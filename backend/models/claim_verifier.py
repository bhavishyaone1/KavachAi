import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Knowledge base of official Indian regulatory directives and fact-checks
TRUSTED_DATABASE = [
    {
        "id": "rag-1",
        "authority": "PIB Fact Check",
        "title": "Fake KBC Lottery WhatsApp Messages",
        "content": "PIB Fact Check confirms that KBC lottery messages claiming you won Rs 25 Lakh on WhatsApp are fake. Kaun Banega Crorepati (KBC) does not run any lucky draw on phone numbers. Scammers send fake certificates to extract processing fees.",
        "url": "https://factcheck.pib.gov.in/factcheckdetails?id=1291",
        "date": "2026-03-10",
        "scam_type": "lottery_scam"
    },
    {
        "id": "rag-2",
        "authority": "Reserve Bank of India (RBI)",
        "title": "KYC Updates and Account Block Warnings",
        "content": "Reserve Bank of India (RBI) clarifies that banks will never block net banking or suspend credit cards via SMS links. Any SMS demanding immediate KYC update to unblock an account is fraudulent. KYC updates must only be performed through secure netbanking or in-person branches.",
        "url": "https://www.rbi.org.in/commonman/English/Scripts/Notification.aspx?id=3401",
        "date": "2025-11-15",
        "scam_type": "kyc_scam"
    },
    {
        "id": "rag-3",
        "authority": "Securities and Exchange Board of India (SEBI)",
        "title": "VIP Stock Groups and Guaranteed Returns",
        "content": "Securities and Exchange Board of India (SEBI) cautions investors against joining VIP stock advisory groups on Telegram, WhatsApp, or other social media. SEBI registered advisors do not guarantee returns or manage portfolios on chat apps. High returns such as 300% in 2 days are stock market scams.",
        "url": "https://www.sebi.gov.in/media/press-releases/jul-2025/caution-against-unauthorized-investment-advisers_81290.html",
        "date": "2025-07-22",
        "scam_type": "investment_scam"
    },
    {
        "id": "rag-4",
        "authority": "CERT-In",
        "title": "YouTube Video Likes and Part-time Job Scams",
        "content": "CERT-In warns against work-from-home scams where victims are offered money for liking YouTube videos or rating maps. The scam begins with small payouts and subsequently forces victims to deposit money in fake crypto or trading accounts.",
        "url": "https://www.cert-in.org.in/advisories/CIAD-2026-0004.html",
        "date": "2026-01-08",
        "scam_type": "job_scam"
    },
    {
        "id": "rag-5",
        "authority": "Reserve Bank of India (RBI)",
        "title": "Unauthorized Digital Lending Applications",
        "content": "Reserve Bank of India warns against downloading unauthorised instant loan apps. Authorized digital lending apps must be registered with RBI as NBFCs or commercial banks. Do not pay processing fees in advance to secure a loan.",
        "url": "https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=54912",
        "date": "2025-05-12",
        "scam_type": "loan_scam"
    },
    {
        "id": "rag-6",
        "authority": "Ministry of Power",
        "title": "Fake Electricity Bill Disconnection Alerts",
        "content": "Ministry of Power warns that electricity departments do not send WhatsApp messages threatening power disconnection by 10 PM. Do not call numbers provided in such SMS or pay via UPI to random contacts.",
        "url": "https://pib.gov.in/PressReleasePage.aspx?PRID=1894210",
        "date": "2025-10-02",
        "scam_type": "upi_scam"
    },
    {
        "id": "rag-7",
        "authority": "Ministry of Home Affairs (CBI)",
        "title": "Digital Arrest Courier scams",
        "content": "Central Bureau of Investigation (CBI) warns of 'digital arrest' scams where fraud callers claim that your international parcel (FedEx/DHL/Speed Post) contains illegal items (drugs/passports) and threaten you with immediate arrest unless you pay clearance fees.",
        "url": "https://www.cybercrime.gov.in/advisory/digital-arrest-customs-scam",
        "date": "2026-02-18",
        "scam_type": "courier_scam"
    }
]

class ClaimVerifierRAG:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(lowercase=True, stop_words="english")
        self.docs_content = [doc["content"] for doc in TRUSTED_DATABASE]
        self.X_docs = self.vectorizer.fit_transform(self.docs_content)

    def verify_claims(self, text: str) -> dict:
        """
        Extracts claims from user input text and searches the local regulatory knowledge base.
        Returns matched citations and verifications.
        """
        if not text or len(text.strip()) < 10:
            return {
                "status": "INSUFFICIENT_EVIDENCE",
                "evidence": None,
                "explanation": "Text too short to verify."
            }

        import time
        start_time = time.time()
        print(f"INFO: Claim verification RAG pipeline started for text={repr(text[:50])}")

        # Vectorize search query
        X_query = self.vectorizer.transform([text])
        similarities = cosine_similarity(X_query, self.X_docs)[0]
        
        best_idx = np.argmax(similarities)
        best_score = float(similarities[best_idx])

        if best_score > 0.18:
            matched_doc = TRUSTED_DATABASE[best_idx]
            
            # Since our database contains advisories WARNING about scams, 
            # if a user text claims something like "You won KBC lottery" 
            # and matches the PIB Fact Check, this claim is CONTRADICTED by official sources.
            # Almost all scam claims matched here will be CONTRADICTED because this is a scam database.
            verdict = "CONTRADICTED"
            explanation = f"Claim contradicts official directives. {matched_doc['authority']} has flagged this pattern as fraudulent."
            
            elapsed = time.time() - start_time
            print(f"INFO: Claim verification completed in {elapsed:.4f}s status={verdict} score={best_score}")

            return {
                "status": verdict,
                "score": round(best_score, 4),
                "explanation": explanation,
                "evidence": {
                    "doc_id": matched_doc["id"],
                    "authority": matched_doc["authority"],
                    "title": matched_doc["title"],
                    "summary": matched_doc["content"],
                    "source_url": matched_doc["url"],
                    "verification_date": matched_doc["date"]
                }
            }

        verdict = "INSUFFICIENT_EVIDENCE"
        elapsed = time.time() - start_time
        print(f"INFO: Claim verification completed in {elapsed:.4f}s status={verdict} score={best_score}")

        return {
            "status": verdict,
            "score": round(best_score, 4),
            "explanation": "No matching official Indian regulatory warnings or fact-checks found in the local knowledge base.",
            "evidence": None
        }

# Singleton instance
claim_verifier = ClaimVerifierRAG()
