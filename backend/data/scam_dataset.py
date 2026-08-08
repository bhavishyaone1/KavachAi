# Multi-class cyber-scam and legitimate message dataset for training the text classifier.
# Labels:
# 0: legitimate
# 1: kyc_scam
# 2: upi_scam
# 3: job_scam
# 4: investment_scam
# 5: lottery_scam
# 6: relative_distress
# 7: loan_scam
# 8: courier_scam
# 9: police_impersonation
# 10: tech_support_scam
# 11: customer_care_scam
# 12: credential_theft

DATASET = [
    # --- Legitimate / Ham Messages (Label 0) ---
    {"text": "Bhai, ghar pahunch ke call karna. Khana ready ho gaya hai.", "label": 0, "category": "legitimate"},
    {"text": "Your OTP for logging into your account is 482910. Do not share it.", "label": 0, "category": "legitimate"},
    {"text": "Hey, let's meet at 5 PM tomorrow in the main hall. Bring the documents.", "label": 0, "category": "legitimate"},
    {"text": "Aapka gas cylinder bill generate ho gaya hai. View details on agency app.", "label": 0, "category": "legitimate"},
    {"text": "Happy Birthday! Wishing you a great year ahead.", "label": 0, "category": "legitimate"},
    {"text": "Hi, I have shared the project slides on your email. Check it out.", "label": 0, "category": "legitimate"},
    {"text": "Kal class kitne baje se hai? Mujhe college ke assignments complete karne hain.", "label": 0, "category": "legitimate"},
    {"text": "Dear customer, your statement for account ending 4321 is ready to download.", "label": 0, "category": "legitimate"},
    {"text": "Please bring some fruits and bread while coming home in the evening.", "label": 0, "category": "legitimate"},
    {"text": "Congratulations on passing your exams with outstanding grades!", "label": 0, "category": "legitimate"},
    {"text": "Aapka package delivery agent block K ke pass deliver kar chuka hai.", "label": 0, "category": "legitimate"},
    {"text": "Hey, can we postpone the project review meeting to Friday?", "label": 0, "category": "legitimate"},
    {"text": "Mummy ne bola hai dahi aur dhaniya le aana subah aate waqt.", "label": 0, "category": "legitimate"},
    {"text": "Ghar ke liye dahi aur sabzi le aana college se aate waqt.", "label": 0, "category": "legitimate"},
    {"text": "Your Swiggy order has been picked up by the delivery partner.", "label": 0, "category": "legitimate"},

    # --- KYC / Bank block Scams (Label 1) ---
    {"text": "Dear Customer, your HDFC netbanking is suspended due to missing PAN card. Verify here: http://hdfc-verify-kyc.in/auth", "label": 1, "category": "kyc_scam"},
    {"text": "SBI account has been blocked. Immediate action required. Update your KYC details to unblock: http://sbi-kyc-verify.net", "label": 1, "category": "kyc_scam"},
    {"text": "Aapka bank account freeze kar diya gaya hai. Unfreeze karne ke liye pan number linked kare: http://pnb-unfreeze-kyc.org", "label": 1, "category": "kyc_scam"},
    {"text": "Alert: Your credit card is deactivated. Log in here to reactivate: http://creditcard-blocked.com/axis", "label": 1, "category": "kyc_scam"},
    {"text": "ICICI Account Alert: KYC details pending. Bank will block service in 24 hours. Update: http://icici-kyc-update.net", "label": 1, "category": "kyc_scam"},

    # --- UPI / Reward Scams (Label 2) ---
    {"text": "PhonePe Cashback: Congratulations! You have received a cashback voucher of Rs. 3,000. Claim here: http://phonepe-reward.in/pay", "label": 2, "category": "upi_scam"},
    {"text": "GPay scratch card: You won Rs 4999. Link open karke claim button click kare aur UPI pin enter kare: http://gpay-win.in", "label": 2, "category": "upi_scam"},
    {"text": "Paytm Reward: Scan this QR code now to receive Rs 15,000 cash directly into your bank account: http://paytm-qr-rewards.net", "label": 2, "category": "upi_scam"},
    {"text": "Government of India UPI Grant: Rs 10,000 approved for you. Claim immediately via UPI link: http://upi-government-grant.org", "label": 2, "category": "upi_scam"},
    {"text": "Aapko PhonePe par Rs 5000 ka cashback mila hai. Bank me pane ke liye ok kare: http://phonepe-cashback-reward.in/pay", "label": 2, "category": "upi_scam"},

    # --- Job Scams (Label 3) ---
    {"text": "Work from home part-time! Earn Rs 3,000 - Rs 8,000 daily by just liking YouTube videos. Contact HR on Telegram: http://t.me/yt-like-job", "label": 3, "category": "job_scam"},
    {"text": "Earn Rs 500 per review by rating Amazon products. Payouts every 1 hour via UPI. Click here to start: http://amazon-reviews-job.in", "label": 3, "category": "job_scam"},
    {"text": "Part-time job vacancy: Make money on mobile daily with simple Google Map rating. Apply now: http://wa.me/917777777777", "label": 3, "category": "job_scam"},
    {"text": "Daily income Rs 4000 guarantee. YouTube ratings. No registration fee. Contact executive: http://t.me/daily-payout-job", "label": 3, "category": "job_scam"},
    {"text": "Make Rs 10000 daily working from home just 20 minutes. Register immediately: http://job-portal-parttime.com", "label": 3, "category": "job_scam"},

    # --- Investment Scams (Label 4) ---
    {"text": "SEBI registered trading experts group. Guaranteed 300% profit in 2 days. Join our VIP WhatsApp channel for tips: http://wa.me/vip-trading", "label": 4, "category": "investment_scam"},
    {"text": "Learn cryptocurrency trading and double your wealth in 1 week. Free course by famous financial guru: http://crypto-guru-india.org", "label": 4, "category": "investment_scam"},
    {"text": "RBI approved safe bonds. Earn 45% annual interest dividends. Chat with wealth advisor on WhatsApp: http://wa-wealth-growth.in", "label": 4, "category": "investment_scam"},
    {"text": "VIP Stock Alerts: 500% profit guaranteed. Join free Telegram group for jackpot stock calls: http://t.me/sebi-jackpot-tips", "label": 4, "category": "investment_scam"},

    # --- KBC / Lottery Scams (Label 5) ---
    {"text": "KBC Lottery Winner: Congratulation! You have won Rs 25 Lakh in KBC lottery. Contact manager Rana Pratap on WhatsApp: http://wa.me/kbc-manager", "label": 5, "category": "lottery_scam"},
    {"text": "Dear customer, you have won a free iPhone 15 from Tata Group. Pay Rs 499 delivery fee to claim: http://tata-free-rewards.org/pay", "label": 5, "category": "lottery_scam"},
    {"text": "Congratulations! Your mobile number won 1st prize in Jio lottery worth 10 Lakhs. Click link to register: http://jio-lottery-claim.org", "label": 5, "category": "lottery_scam"},

    # --- Relative Distress Scams (Label 6) ---
    {"text": "Papa, mera mobile chori ho gaya hai. Accident ho gaya hai aur hospital me hu. Upi Rs 10,000 urgently: hospitalhelp9@okaxis", "label": 6, "category": "relative_distress"},
    {"text": "Mummy, urgent emergency! Police ne accident case me pakad liya hai. Please is inspecter ko Rs 15,000 pay kar do: inspectorgpay@ybl", "label": 6, "category": "relative_distress"},
    {"text": "Hey Dad, my phone broke. Messaging from friend's mobile. Need to pay medicine bill. Send Rs 8,000 to this UPI: medipay99@paytm", "label": 6, "category": "relative_distress"},
    {"text": "Bhaiya urgent accident ho gaya hai doctor rs 5000 deposit karne bol raha hai. Direct upi kar de doctor ko upi id: doctorpay9@okicici", "label": 6, "category": "relative_distress"},

    # --- Loan Scams (Label 7) ---
    {"text": "Instant Loan Alert: Get personal loan up to Rs 5 Lakh without documents in 5 minutes. No interest. Download app: http://instant-loan-easy.xyz", "label": 7, "category": "loan_scam"},
    {"text": "RBI approved digital loan. Low EMI. Get credit approved instantly and cash transfer to bank. Click: http://rbi-approved-loans.top", "label": 7, "category": "loan_scam"},
    {"text": "Need money urgently? Personal loan up to 10 Lakhs approved with 0% interest rate. Pay processing fee of Rs 999: http://easy-loan-pay.net", "label": 7, "category": "loan_scam"},

    # --- Courier / Customs Scams (Label 8) ---
    {"text": "FedEx Courier Alert: Your parcel containing illegal substances has been intercepted by customs. Verify with police via Skype: http://fedex-customs-verify.xyz", "label": 8, "category": "courier_scam"},
    {"text": "Your international parcel from London is held at Delhi airport customs. Pay clearance tax of Rs 28,000 immediately: http://customs-tax-clearance.org", "label": 8, "category": "courier_scam"},
    {"text": "Speed Post Customs Alert: Illegal passports found in your shipment. Connect with police immediately to clear charges: http://india-post-customs.net", "label": 8, "category": "courier_scam"},

    # --- Police Impersonation Scams (Label 9) ---
    {"text": "CBI Directorate Alert: You are under digital arrest due to illegal items found linked to your Aadhaar card. Join immediate Skype investigation: http://cbi-gov-desk.net/case-348", "label": 9, "category": "police_impersonation"},
    {"text": "Mumbai Cyber Police: A warrant is issued in your name for financial money laundering. Connect with Cyber Cell inspector immediately to verify identity: http://cybercell-mumbai-dept.org", "label": 9, "category": "police_impersonation"},
    {"text": "Aadhaar illegal package tracking warning: Narcotics division has flagged a parcel to your address containing drugs. Resolve case with narcotics police: http://narcotics-dept-verify.net", "label": 9, "category": "police_impersonation"},

    # --- Tech Support Scams (Label 10) ---
    {"text": "Windows Firewall Warning: Your computer has been locked due to critical Trojan virus infection. Call Microsoft Certified Helpline now to prevent data theft: +91 800-459-2189", "label": 10, "category": "tech_support_scam"},
    {"text": "Apple Security Alert: Unauthorized access detected on your iCloud account. Device locked. Contact Apple care immediately at +91 1800-999-4321 to secure your files.", "label": 10, "category": "tech_support_scam"},

    # --- Customer Care Scams (Label 11) ---
    {"text": "Paytm Customer Support: For processed transaction refunds or pending cashbacks, call our helpline numbers immediately at +91 98765-43210.", "label": 11, "category": "customer_care_scam"},
    {"text": "Amazon Delivery refund issues: To resolve pending order delivery or claim cash refund contact Swiggy/Amazon manager now at +91 88888-99999.", "label": 11, "category": "customer_care_scam"},

    # --- Credential Theft (Label 12) ---
    {"text": "Google Security: We detected a suspicious login attempt on your account from Noida. If this was not you, click link to change password and secure credentials: http://myaccount-google-secure.xyz", "label": 12, "category": "credential_theft"},
    {"text": "Jio SIM Card verification alert: Your SIM card services will deactivate in 24 hours. Log in here with password and OTP to verify: http://jio-sim-verify.net", "label": 12, "category": "credential_theft"},
    {"text": "Netbanking security alert: Suspicious device login detected. Lock your account credentials instantly by confirming your OTP: http://netbanking-security-lock.xyz", "label": 12, "category": "credential_theft"}
]

# Generate synthetic samples to balance categories and expand vocab
def get_training_data():
    dataset = list(DATASET)
    
    # 1. Expand Legitimate / Ham Samples (Label 0) to prevent false positives
    ham_templates = [
        "Hey! Are you coming to play football today?",
        "Aapka code compile ho gaya hai. Git pull kar lena repository se.",
        "Mummy ne bola hai jaldi ghar aao, guest aa rahe hain.",
        "Your ride with Ola is booked. OTP is {otp}.",
        "Can we schedule our call at {time} tomorrow?",
        "Please find the invoice copy for last month's rent.",
        "Happy Birthday! Have a wonderful day ahead.",
        "Aapka package delivery agent block k pass pahunch chuka hai.",
        "We are starting the webinar in 10 minutes. Click link: https://zoom.us/join",
        "Hi, is this Bhavishya? I wanted to check about the project status.",
        "Your Swiggy delivery will arrive in 15 minutes. Contact driver.",
        "Dear customer, your credit card statement is ready for billing cycle.",
        "Can you send me the math notes we wrote yesterday?",
        "Kal college aana hai kya? Assignment submit karna hai.",
        "Ghar aate waqt dahi aur bread le aana please.",
        "Bhaiya, Didi bol rahi thi ki aaj shaam ko jaldi aana hai.",
        "Your appointment with Dr. Sharma is scheduled for tomorrow at 10 AM.",
        "Please complete the feedback form for the training session.",
        "Your electricity bill of Rs {amt} has been paid successfully.",
        "Netflix subscription renewed. Invoice sent to registered mail.",
        "Hey! Long time no see. Let's catch up sometime next week.",
        "Meeting room has been booked for project review at 3 PM.",
        "Your OTP for bank login is {otp}. Valid for 3 minutes.",
        "Kal test hai physics ka? Notes padh ke aana please."
    ]
    
    import random
    random.seed(42)
    
    # Generate 140 unique ham messages
    for i in range(140):
        template = random.choice(ham_templates)
        otp = str(random.randint(100000, 999999))
        time = f"{random.randint(1,12)}:{random.randint(10,59)} {random.choice(['AM', 'PM'])}"
        amt = str(random.randint(500, 4500))
        dataset.append({
            "text": template.format(otp=otp, time=time, amt=amt),
            "label": 0,
            "category": "legitimate"
        })

    # 2. Expand KYC Scams (Label 1)
    banks = ["SBI", "HDFC", "ICICI", "PNB", "AXIS", "BOB", "Yes Bank"]
    for bank in banks:
        dataset.append({
            "text": f"Dear customer, your {bank} credit card is suspended due to document verification. Click link to update KYC: http://{bank.lower()}-blocked-card.net/kyc",
            "label": 1,
            "category": "kyc_scam"
        })
        dataset.append({
            "text": f"Aapka {bank} bank account freeze ho chuka hai block unfreeze karne ke liye click kare: http://{bank.lower()}-unfreeze.org/kyc",
            "label": 1,
            "category": "kyc_scam"
        })

    # 3. Expand UPI Cashback Scams (Label 2)
    for i in range(12):
        amt = random.randint(1999, 9999)
        app = random.choice(["PhonePe", "Google Pay", "GPay", "Paytm"])
        dataset.append({
            "text": f"Congratulations! You won a scratch card of Rs {amt} on {app}. Claim in bank now: http://{app.lower().replace(' ', '')}-win-rewards.net/claim",
            "label": 2,
            "category": "upi_scam"
        })

    # 4. Expand Job Scams (Label 3)
    platforms = ["YouTube", "Amazon", "Google Reviews", "Instagram likes", "TikTok reviews"]
    for pl in platforms:
        dataset.append({
            "text": f"Make money online! Earn Rs {random.randint(2000,6000)} daily by simple {pl} rating. Gpay/Phonepe payouts. Join Telegram channel: http://t.me/parttime-job-{pl.lower().replace(' ', '')}",
            "label": 3,
            "category": "job_scam"
        })

    # 5. Expand Relative Emergency Scams (Label 6)
    names = ["Papa", "Mummy", "Dad", "Mom", "Bhai", "Didi"]
    relations = ["accident", "medical emergency", "police trap", "lost wallet", "hospital bill"]
    upis = ["helpme@okaxis", "carepay@ybl", "medicpay@okicici", "emergencypay@paytm", "friendpay@oksbi"]
    for i in range(12):
        name = random.choice(names)
        rel = random.choice(relations)
        upi = random.choice(upis)
        amt = random.randint(3000, 25000)
        dataset.append({
            "text": f"{name}, urgent help. Mera {rel} ho gaya hai. Phone work nahi kar raha. Merchant ko UPI transfer kar do Rs {amt} immediately: {upi}",
            "label": 6,
            "category": "relative_distress"
        })

    # 6. Generate variations for Police Impersonation (Label 9)
    police_departments = ["Delhi Police", "Mumbai Cyber Crime", "CBI Directorate", "Narcotics Control Bureau", "NIA Agency"]
    offenses = ["drugs money laundering", "illegal Aadhaar package tracking", "financial terror funding", "customs illegal shipment check"]
    contact_channels = ["Skype video desk", "Cyber police room", "narcotics division call", "CBI desk channel"]
    for i in range(15):
        dept = random.choice(police_departments)
        offense = random.choice(offenses)
        channel = random.choice(contact_channels)
        dataset.append({
            "text": f"{dept} Notification: You are placed under digital arrest due to {offense} linked to your ID. Connect with officer on {channel} immediately: http://cyber-{dept.lower().split()[0]}-portal.xyz/verify",
            "label": 9,
            "category": "police_impersonation"
        })

    # 7. Generate variations for Tech Support (Label 10)
    platforms_os = ["Windows Security", "Microsoft Account Care", "Apple Security", "Google Device Guard"]
    threats = ["Trojan spyware virus", "Critical phishing exploit", "Ransomware data encryptor", "Adware registry compromise"]
    helplines = ["+91 800-459-2189", "+91 1800-999-4321", "+91 888-219-4500", "+91 1800-419-5830"]
    for i in range(15):
        plat = random.choice(platforms_os)
        threat = random.choice(threats)
        phone = random.choice(helplines)
        dataset.append({
            "text": f"CRITICAL: {plat} detected suspicious trojan infection ({threat}). Computer files locked. Call certified support team helpline immediately at {phone} to prevent permanent data deletion.",
            "label": 10,
            "category": "tech_support_scam"
        })

    # 8. Generate variations for Customer Care Scams (Label 11)
    brands_services = ["Paytm cashback", "Swiggy refund manager", "Zomato delivery help", "PhonePe payment support", "Amazon prime reward refund"]
    helplines_cc = ["+91 98765-43210", "+91 88888-99999", "+91 77777-88888", "+91 99999-88888"]
    for i in range(15):
        brand = random.choice(brands_services)
        phone = random.choice(helplines_cc)
        dataset.append({
            "text": f"Important refund update on {brand} service. To claim pending cashback or instant wallet refund directly in bank, call Swiggy/Paytm manager immediately: {phone}.",
            "label": 11,
            "category": "customer_care_scam"
        })

    # 9. Generate variations for Credential Theft (Label 12)
    portals = ["Google myaccount", "Facebook privacy settings", "HDFC Netbanking portal", "SBI Online portal", "Jio SIM registration desk"]
    for i in range(15):
        portal = random.choice(portals)
        dataset.append({
            "text": f"Security Alert: Someone attempted login to your {portal} from an unverified location. Change password and secure credentials instantly using OTP verify: http://{portal.lower().replace(' ', '-')}-secure-update.xyz/login",
            "label": 12,
            "category": "credential_theft"
        })

    return dataset
