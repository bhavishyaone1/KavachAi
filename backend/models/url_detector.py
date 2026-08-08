import os
import re
import joblib
import socket
from urllib.parse import urlparse
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from backend.data.url_dataset import get_url_training_data

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(MODEL_DIR, "cached_url_model.joblib")

# Whitelist of common trusted domains to check typosquatting against
TRUSTED_BRANDS = {
    "paytm": ["paytmm", "paytm-kyc", "paytm-cashback", "paytmrewards", "paytmk"],
    "phonepe": ["phonepe-reward", "phone-pe", "phonepe5000", "phoneperewards"],
    "google": ["gpay-scratchcard", "g-pay", "gpayrewards", "google-reviews"],
    "amazon": ["amzon", "amazon-reviews", "amazonjob", "amazon-payout"],
    "sbi": ["sbi-kyc", "sbi-verify", "sbi-block", "onlinesbi-update"],
    "hdfc": ["hdfcbank-kyc", "hdfc-verify", "hdfc-blocked", "hdfckyc"],
    "icici": ["icici-unfreeze", "icici-login", "icici-kyc"],
}

SUSPICIOUS_TLDS = {".xyz", ".top", ".tk", ".ml", ".ga", ".cf", ".gq", ".cc", ".club", ".click", ".info", ".work", ".site", ".online"}

def edit_distance(s1, s2):
    if len(s1) > len(s2):
        s1, s2 = s2, s1
    distances = range(len(s1) + 1)
    for i2, c2 in enumerate(s2):
        distances_ = [i2+1]
        for i1, c1 in enumerate(s1):
            if c1 == c2:
                distances_.append(distances[i1])
            else:
                distances_.append(1 + min((distances[i1], distances[i1 + 1], distances_[-1])))
        distances = distances_
    return distances[-1]

class URLScamDetector:
    def __init__(self):
        self.model = None
        self.load_or_train_model()

    def extract_features(self, url: str) -> list:
        """
        Extracts 11 lexical features from a URL for ML training and inference.
        """
        url_to_parse = url
        if not url.startswith(("http://", "https://")):
            url_to_parse = "http://" + url

        try:
            parsed = urlparse(url_to_parse)
            domain = parsed.netloc.lower()
            if ":" in domain:
                domain = domain.split(":")[0]
        except Exception:
            domain = url.lower()

        # 1. URL Length
        url_len = len(url)
        # 2. Hostname Length
        host_len = len(domain)
        # 3. Dots count
        qty_dots = domain.count(".")
        # 4. Hyphens count
        qty_hyphens = domain.count("-")
        # 5. Digits count
        qty_digits = sum(c.isdigit() for c in domain)
        # 6. Subdomain count (approximate)
        qty_subdomains = max(0, len(domain.split(".")) - 2)
        
        # 7. Raw IP usage (e.g. http://192.168.1.1/login)
        is_ip = 1 if re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", domain) else 0
        
        # 8. Punycode check (homograph check)
        is_puny = 1 if "xn--" in domain else 0
        
        # 9. Presence of '@' symbol
        has_at = 1 if "@" in url else 0
        
        # 10. High-risk TLD
        has_suspicious_tld = 0
        for tld in SUSPICIOUS_TLDS:
            if domain.endswith(tld):
                has_suspicious_tld = 1
                break
                
        # 11. HTTPS usage
        is_https = 1 if url.startswith("https://") else 0

        return [url_len, host_len, qty_dots, qty_hyphens, qty_digits, qty_subdomains, is_ip, is_puny, has_at, has_suspicious_tld, is_https]

    def load_or_train_model(self):
        if os.path.exists(MODEL_PATH):
            try:
                self.model = joblib.load(MODEL_PATH)
                return
            except Exception as e:
                print(f"Error loading URL model, retraining... Error: {e}")

        # Train a new model
        print("Training URL phishing classifier...")
        dataset = get_url_training_data()
        
        X = []
        y = []
        for sample in dataset:
            X.append(self.extract_features(sample["url"]))
            y.append(sample["label"])
            
        X = np.array(X)
        y = np.array(y)

        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X, y)

        joblib.dump(self.model, MODEL_PATH)
        print("URL phishing classifier trained and saved.")

    def analyze(self, url: str) -> dict:
        if not url:
            return {
                "score": 0.0,
                "label": "Safe",
                "domain": "",
                "flags": [],
                "explanation": "No URL provided."
            }

        import time
        start_time = time.time()
        print(f"INFO: URL analysis started for url={url}")
        
        url_to_parse = url
        if not url.startswith(("http://", "https://")):
            url_to_parse = "http://" + url

        try:
            parsed = urlparse(url_to_parse)
            domain = parsed.netloc.lower()
            if ":" in domain:
                domain = domain.split(":")[0]
        except Exception:
            domain = url.lower()

        # 1. ML Scoring using Random Forest
        features = self.extract_features(url)
        ml_prob = float(self.model.predict_proba(np.array([features]))[0][1])

        # 2. Typosquatting Check (Levenshtein brand registry)
        base_domain = domain.split(".")[-2] if len(domain.split(".")) >= 2 else domain
        
        typo_detected = False
        target_brand = ""
        for brand, typos in TRUSTED_BRANDS.items():
            if base_domain in typos or brand in base_domain:
                official_domains = [f"{brand}.com", f"{brand}.in", f"online{brand}.com", f"online{brand}.in"]
                is_official = False
                for off in official_domains:
                    if domain == off or domain.endswith("." + off):
                        is_official = True
                        break
                
                if not is_official:
                    typo_detected = True
                    target_brand = brand
                    break

        if not typo_detected:
            for brand in TRUSTED_BRANDS.keys():
                dist = edit_distance(base_domain, brand)
                if dist in [1, 2] and base_domain != brand:
                    typo_detected = True
                    target_brand = brand
                    break

        # 3. Live DNS resolution check with timeout
        dns_resolves = True
        ip_addr = ""
        try:
            # Set quick socket timeout bounds
            socket.setdefaulttimeout(2.5)
            # Basic sanity check (don't resolve localhost or raw IPs)
            if not re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", domain) and domain != "localhost":
                ip_addr = socket.gethostbyname(domain)
        except Exception:
            dns_resolves = False

        # Blend ML prediction with typosquatting & DNS checks
        final_score = ml_prob
        flags = []
        reasons = []

        # Feature flags for explainability
        # features indices: 7: is_puny, 9: has_suspicious_tld, 10: is_https
        if features[7] == 1:
            final_score = max(final_score, 0.85)
            flags.append("punycode_homograph")
            reasons.append("Punycode detected (potential homograph impersonation).")
        
        if typo_detected:
            final_score = max(final_score, 0.80)
            flags.append("typosquatting")
            reasons.append(f"Typosquatting alert: resembles trusted brand '{target_brand.capitalize()}'")
            
        if not dns_resolves:
            # Boost score significantly if domain name does not resolve
            final_score = max(final_score, 0.85)
            flags.append("unregistered_dns_record")
            reasons.append("Domain has no active DNS record (potential temporary scam domain).")
            
        if features[9] == 1:
            flags.append("suspicious_tld")
            reasons.append("Uses low-cost or high-risk TLD.")
            
        if features[10] == 0:
            flags.append("insecure_connection")
            reasons.append("Uses unencrypted HTTP connection.")

        # Determine label
        if final_score > 0.65:
            verdict = "High Risk"
            explanation = "Danger: Flagged as a phishing or spoofed URL. " + " ".join(reasons)
        elif final_score > 0.2:
            verdict = "Medium Risk"
            explanation = "Warning: URL displays suspicious indicators. " + " ".join(reasons)
        else:
            verdict = "Safe"
            explanation = "URL looks safe. Standard domain structures and trusted TLD verified."

        elapsed = time.time() - start_time
        print(f"INFO: URL analysis completed in {elapsed:.4f}s score={final_score} verdict={verdict}")

        return {
            "score": round(final_score, 4),
            "label": verdict,
            "domain": domain,
            "flags": flags,
            "explanation": explanation
        }

# Singleton instance
detector = URLScamDetector()
