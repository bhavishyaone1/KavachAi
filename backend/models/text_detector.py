import os
import re
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction import text as sklearn_text
from backend.data.scam_dataset import get_training_data

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(MODEL_DIR, "cached_text_model.joblib")

# Heuristics lists
UPI_PATTERN = re.compile(r"[a-zA-Z0-9.\-_]{2,256}@(okaxis|okicici|oksbi|paytm|ybl|apl|upi|yapl|okhdfcbank|okaxis|icici|barodampay|dlb|axl|fifederal|axisbank|payzapp|hsbc)")
URL_PATTERN = re.compile(r"https?://[^\s/$.?#].[^\s]*")
PHONE_PATTERN = re.compile(r"\+?91[6-9]\d{9}\b|\b[6-9]\d{9}\b|\+?91\s\d{5}\s\d{5}\b")

SCAM_KEYWORDS = [
    "block", "suspend", "kyc", "verify", "verification", "deactivate",
    "unfreeze", "accident", "hospital", "emergency", "police", "arrest",
    "fine", "court", "cashback", "reward", "lottery", "won", "prize",
    "kbc", "part-time", "earn", "weekly payout", "youtube likes", "work from home",
    "guaranteed return", "sebi", "investment tips", "trading group",
    "electricity bill", "power cut", "disconnection", "customs", "illegal parcel",
    "digital arrest", "money laundering", "narcotics", "iCloud", "Trojan virus",
    "certified support", "helpline", "security alert", "delivery refund", "clearance fee"
]

HINGLISH_STOP_WORDS = {
    "ke", "liye", "se", "ko", "ki", "ka", "pe", "par", "hai", "ho", "gaya", 
    "aur", "ya", "ek", "me", "main", "kar", "kare", "karna", "kr", "kra", 
    "diya", "do", "karke", "sa", "hi", "he", "bhai", "bhaiya", "didi",
    "mummy", "papa", "dad", "mom", "home", "work", "job"
}

CATEGORY_MAP = {
    0: "legitimate",
    1: "kyc_scam",
    2: "upi_scam",
    3: "job_scam",
    4: "investment_scam",
    5: "lottery_scam",
    6: "relative_distress",
    7: "loan_scam",
    8: "courier_scam",
    9: "police_impersonation",
    10: "tech_support_scam",
    11: "customer_care_scam",
    12: "credential_theft"
}

class TextScamDetector:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.load_or_train_model()

    def load_or_train_model(self):
        if os.path.exists(MODEL_PATH):
            try:
                data = joblib.load(MODEL_PATH)
                self.model = data["model"]
                self.vectorizer = data["vectorizer"]
                return
            except Exception as e:
                print(f"Error loading text model, retraining... Error: {e}")

        # Train a new model
        print("Training multi-class text scam classifier...")
        dataset = get_training_data()
        texts = [sample["text"] for sample in dataset]
        labels = [sample["label"] for sample in dataset]

        # Combine standard stop words with Hinglish particles to reduce false positives
        stop_words = list(sklearn_text.ENGLISH_STOP_WORDS.union(HINGLISH_STOP_WORDS))

        self.vectorizer = TfidfVectorizer(
            lowercase=True, 
            stop_words=stop_words, 
            ngram_range=(1, 2),
            token_pattern=r'\b\w+\b'
        )
        X = self.vectorizer.fit_transform(texts)
        self.model = LogisticRegression(C=10.0, max_iter=300)
        self.model.fit(X, labels)

        # Save model
        joblib.dump({"model": self.model, "vectorizer": self.vectorizer}, MODEL_PATH)
        print("Multi-class text scam classifier trained and saved.")

    def analyze(self, text: str) -> dict:
        if not text.strip():
            return {
                "score": 0.0,
                "label": "Legitimate",
                "category": "legitimate",
                "confidence": 1.0,
                "upi_ids": [],
                "urls": [],
                "phones": [],
                "flagged_keywords": [],
                "explanation": "No text provided for analysis."
            }

        import time
        start_time = time.time()
        print(f"INFO: Text analysis started for text={repr(text[:50])}")

        # 1. ML Scoring
        X_test = self.vectorizer.transform([text])
        probs = self.model.predict_proba(X_test)[0]
        
        pred_label_id = int(self.model.predict(X_test)[0])
        pred_category = CATEGORY_MAP.get(pred_label_id, "unknown")
        confidence = float(probs[pred_label_id])

        # Overall scam probability is the sum of all scam classes (1 to 12)
        scam_prob = float(sum(probs[1:]))

        # 2. Heuristics Extraction
        full_upis = [match.group(0) for match in UPI_PATTERN.finditer(text)]
        urls = URL_PATTERN.findall(text)
        
        # Phone numbers extraction
        phones = []
        for match in PHONE_PATTERN.finditer(text):
            phones.append(match.group(0))

        # Check keyword matches
        matched_keywords = []
        text_lower = text.lower()
        for kw in SCAM_KEYWORDS:
            if kw in text_lower:
                matched_keywords.append(kw)

        # Heuristic Risk Boost
        heuristic_score = 0.0
        reasons = []

        if full_upis:
            heuristic_score += 0.45
            reasons.append(f"Contains UPI handle(s): {', '.join(full_upis)}")
        if urls:
            heuristic_score += 0.25
            reasons.append("Contains link(s)")
        if len(matched_keywords) >= 2:
            heuristic_score += 0.35
            reasons.append(f"Suspicious scam vocabulary detected: {matched_keywords[:4]}")
        elif len(matched_keywords) == 1:
            heuristic_score += 0.15
            reasons.append(f"Urgency/Threat indicator: '{matched_keywords[0]}'")

        # Final aggregate score: hybrid model + heuristics capped at 1.0
        final_score = min(max(scam_prob, heuristic_score), 1.0)
        
        # Override prediction class if score gets elevated significantly by heuristics
        if final_score > 0.65 and pred_category == "legitimate":
            pred_category = "upi_scam" if full_upis else "phishing"
            confidence = final_score

        # Determine explanation
        if final_score > 0.7:
            verdict = "High Risk"
            explanation = f"Flagged as a potential {pred_category.replace('_', ' ')}. " + " ".join(reasons) + " Pattern matches typical social engineering structures."
        elif final_score > 0.30:
            verdict = "Medium Risk"
            explanation = f"Caution advised. Moderate match for {pred_category.replace('_', ' ')} indicators. " + " ".join(reasons)
        else:
            verdict = "Legitimate"
            explanation = "Message appears normal. No prominent phishing patterns or malicious indicators detected."

        elapsed = time.time() - start_time
        print(f"INFO: Text analysis completed in {elapsed:.4f}s score={final_score} verdict={verdict}")

        return {
            "score": round(final_score, 4),
            "label": verdict,
            "category": pred_category,
            "confidence": round(confidence, 4),
            "upi_ids": full_upis,
            "urls": urls,
            "phones": list(set(phones)),
            "flagged_keywords": matched_keywords,
            "explanation": explanation
        }

# Singleton instance
detector = TextScamDetector()
