# Labeled dataset of phishing/scam URLs and legitimate domains for training the local URL classifier.
# Labels:
# 1: Phishing / Scam URL
# 0: Legitimate URL

URL_DATASET = [
    # --- Legitimate Domains (Label 0) ---
    {"url": "https://www.google.com", "label": 0},
    {"url": "https://www.amazon.in", "label": 0},
    {"url": "https://paytm.com", "label": 0},
    {"url": "https://www.phonepe.com", "label": 0},
    {"url": "https://www.rbi.org.in", "label": 0},
    {"url": "https://www.sebi.gov.in", "label": 0},
    {"url": "https://pib.gov.in", "label": 0},
    {"url": "https://github.com", "label": 0},
    {"url": "https://www.microsoft.com", "label": 0},
    {"url": "https://www.wikipedia.org", "label": 0},
    {"url": "https://www.facebook.com", "label": 0},
    {"url": "https://www.youtube.com", "label": 0},
    {"url": "https://www.linkedin.com", "label": 0},
    {"url": "https://twitter.com", "label": 0},
    {"url": "https://apple.com", "label": 0},
    {"url": "https://netflix.com", "label": 0},
    {"url": "https://www.cybercrime.gov.in", "label": 0},
    {"url": "https://www.meity.gov.in", "label": 0},
    {"url": "https://www.cert-in.org.in", "label": 0},
    {"url": "https://bhashini.gov.in", "label": 0},
    {"url": "https://zoom.us", "label": 0},
    {"url": "https://swiggy.com", "label": 0},
    {"url": "https://zomato.com", "label": 0},
    {"url": "https://irctc.co.in", "label": 0},
    {"url": "https://uidai.gov.in", "label": 0},

    # --- Phishing / Scam Domains (Label 1) ---
    {"url": "http://paytmm-rewards.com", "label": 1},
    {"url": "http://phonepe-reward5000.in", "label": 1},
    {"url": "http://sbi-kyc-verify.net", "label": 1},
    {"url": "http://pnb-unfreeze-kyc.org", "label": 1},
    {"url": "http://gpay-win.in", "label": 1},
    {"url": "http://amazon-task-hr.info", "label": 1},
    {"url": "http://whatsapp-wealth-growth.in", "label": 1},
    {"url": "http://crypto-guru-india.org", "label": 1},
    {"url": "http://easy-loan-pay.net", "label": 1},
    {"url": "http://fedex-customs-verify.xyz", "label": 1},
    {"url": "http://icici-unfreeze.org", "label": 1},
    {"url": "http://gpay-scratchcard-win.in", "label": 1},
    {"url": "http://tata-free-rewards.org/pay", "label": 1},
    {"url": "http://bill-pay-electricity.com/upi", "label": 1},
    {"url": "http://refundphonepe.xyz", "label": 1},
    {"url": "http://kbc-lottery-claim.org", "label": 1},
    {"url": "http://instant-loan-easy.xyz", "label": 1},
    {"url": "http://sbi-blocked-card.net/kyc", "label": 1},
    {"url": "http://india-post-customs.net", "label": 1},
    {"url": "http://hdfc-verify-kyc.in/auth", "label": 1}
]

# Generate synthetic variations to boost data variance
def get_url_training_data():
    dataset = list(URL_DATASET)
    
    # 1. Generate more legitimate variations (Label 0)
    legit_hosts = [
        "google", "yahoo", "bing", "outlook", "gmail", "bankofbaroda",
        "axisbank", "icicibank", "hdfcbank", "statebankofindia",
        "incometax.gov", "digitallocker.gov", "cowin.gov", "passportindia.gov",
        "quora", "medium", "dev.to", "stackoverflow", "reddit", "slack"
    ]
    tlds = [".com", ".in", ".org", ".gov.in", ".co.in", ".net"]
    
    import random
    random.seed(42)
    
    for host in legit_hosts:
        for tld in tlds[:3]:
            dataset.append({
                "url": f"https://www.{host}{tld}",
                "label": 0
            })
            
    # 2. Generate more phishing variations (Label 1)
    brands = ["sbi", "paytm", "phonepe", "gpay", "hdfc", "icici", "amazon", "fedex"]
    scam_keywords = ["rewards", "verify", "kyc", "blocked", "unfreeze", "support", "bonus", "gift", "jobs"]
    bad_tlds = [".xyz", ".top", ".tk", ".ml", ".ga", ".cf", ".club", ".click", ".info", ".net-update.org"]
    
    for i in range(50):
        brand = random.choice(brands)
        kw = random.choice(scam_keywords)
        tld = random.choice(bad_tlds)
        
        # Variations like brand-rewards.xyz or verify-brand.top
        pattern = random.choice([
            f"http://{brand}-{kw}{tld}",
            f"http://{kw}-{brand}{tld}",
            f"http://{brand}{kw}{tld}"
        ])
        dataset.append({
            "url": pattern,
            "label": 1
        })
        
    return dataset
