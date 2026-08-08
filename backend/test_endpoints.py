import sys
import os
import tempfile

# Append root folder to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.models.text_detector import detector as text_detector
from backend.models.url_detector import detector as url_detector
from backend.models.audio_detector import detector as audio_detector
from backend.models.lipsync_detector import detector as lipsync_detector
from backend.utils.document_processor import document_processor
from backend.models.fusion_risk import fusion_layer

def test_text_classifier():
    print("Testing Text Classifier...")
    scam_msg = "Dear customer, SBI account block ho gaya hai, KYC update kare click: http://sbi-kyc-verify.net"
    result = text_detector.analyze(scam_msg)
    print(f"Scam Text Result: Score={result['score']}, Label={result['label']}, Category={result['category']}")
    assert result["score"] > 0.5, "Scam text should have high score"
    assert "kyc" in result["flagged_keywords"], "Should flag kyc keyword"
    
    police_msg = "CBI Directorate Alert: You are under digital arrest due to illegal items found linked to your Aadhaar card. Join immediate Skype investigation: http://cbi-gov-desk.net/case-348"
    result_police = text_detector.analyze(police_msg)
    print(f"Police Impersonation Result: Score={result_police['score']}, Label={result_police['label']}, Category={result_police['category']}")
    assert result_police["score"] > 0.5, "Digital arrest scam should have high score"
    assert "police_impersonation" in result_police["category"], "Should classify as police impersonation"
    
    ham_msg = "Ghar ke liye dahi aur sabzi le aana college se aate waqt."
    result_ham = text_detector.analyze(ham_msg)
    print(f"Ham Text Result: Score={result_ham['score']}, Label={result_ham['label']}")
    assert result_ham["score"] < 0.3, "Ham text should have low score"
    print("OK: Text Classifier verified\n")

def test_url_classifier():
    print("Testing URL Classifier...")
    url1 = "paytmm-rewards.com"
    res1 = url_detector.analyze(url1)
    print(f"URL: {url1} -> Score={res1['score']}, Label={res1['label']}, Flags={res1['flags']}")
    assert "typosquatting" in res1["flags"], "Should flag typosquatting"
    
    url2 = "https://xn--sbi-c2a.com"
    res2 = url_detector.analyze(url2)
    print(f"URL: {url2} -> Score={res2['score']}, Label={res2['label']}, Flags={res2['flags']}")
    assert "punycode_homograph" in res2["flags"], "Should flag homograph punycode"
    
    url3 = "https://amazon.in"
    res3 = url_detector.analyze(url3)
    print(f"URL: {url3} -> Score={res3['score']}, Label={res3['label']}")
    assert res3["score"] < 0.2, "Official domain should have low score"
    print("OK: URL Classifier verified\n")

def test_audio_classifier():
    print("Testing Audio Classifier...")
    human_prob = audio_detector.model.predict_proba([[0.08, 0.15, 1100.0, 1800.0, 680.0]])[0][1]
    spoof_prob = audio_detector.model.predict_proba([[0.15, 0.18, 2200.0, 3100.0, 45.0]])[0][1]
    
    print(f"Audio predictions: Human prob of spoof={human_prob}, Spoof prob of spoof={spoof_prob}")
    assert spoof_prob > 0.6, "Spoofed features should have high spoof probability"
    assert human_prob < 0.4, "Human features should have low spoof probability"
    print("OK: Audio Classifier verified\n")

def test_lipsync_detector():
    print("Testing Lip-Sync Detector...")
    res_drift = lipsync_detector.estimate_sync("dummy_deepfake_drift.mp4")
    res_ok = lipsync_detector.estimate_sync("legit_human_speech.mp4")
    
    print(f"Sync Mismatch Drift Score: {res_drift['score']}, status={res_drift['status']}")
    print(f"Sync Match Ok Score: {res_ok['score']}, status={res_ok['status']}")
    
    assert res_drift["score"] > 0.5, "Drift video should return anomalous score"
    assert res_ok["score"] < 0.1, "Aligned video should return synchronized score"
    print("OK: Lip-Sync Detector verified\n")

def test_document_processor():
    print("Testing Document Forensics Parser...")
    eml_content = (
        "From: HDFC Support Service <scammer@gmail.com>\n"
        "Reply-To: refund-payment@scam-server.xyz\n"
        "Subject: Account Blocked Update\n\n"
        "Dear customer, pay Rs 500 to claim cashback and update KYC: refund@okaxis"
    )
    
    with tempfile.NamedTemporaryFile(suffix=".eml", delete=False, mode="w", encoding="utf-8") as f:
        f.write(eml_content)
        temp_path = f.name

    try:
        doc_res = document_processor.process_document(temp_path, "alert_payment.eml")
        print(f"Document Parser Results: Flags={doc_res['flags']}, UPIs={doc_res['upi_ids']}")
        
        assert "email_reply_to_mismatch" in doc_res["flags"], "Should flag reply-to header spoof mismatch"
        assert "free_mail_bank_impersonation" in doc_res["flags"], "Should flag free email bank impersonations"
        assert "refund@okaxis" in doc_res["upi_ids"], "Should extract UPI VPA address"
        
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
    print("OK: Document Forensics Parser verified\n")

def test_risk_fusion_complete():
    print("Testing Complete Cross-Modal Risk Fusion...")
    text_res = text_detector.analyze("Mummy urgent accident ho gaya hai doctor rs 5000 deposit karne bol raha hai. upi: doctorpay9@okicici")
    url_res = url_detector.analyze("http://pnb-unfreeze-kyc.org")
    audio_res = audio_detector.analyze("dummy.wav", "voice_clone_spoof.wav")
    sync_res = lipsync_detector.estimate_sync("deepfake_drift_face.mp4")
    
    fused = fusion_layer.fuse_results(
        text_res=text_res,
        url_res=url_res,
        audio_res=audio_res,
        sync_res=sync_res
    )
    print(f"Fused Complete Risk Score: {fused['Overall Fraud Risk']}%")
    print(f"Reasons: {fused['Reasons']}")
    
    assert fused["Overall Fraud Risk"] >= 90, "Multi-modal correlation should return critical threat score"
    print("OK: Complete Risk Fusion verified\n")

if __name__ == "__main__":
    print("==========================================")
    print("KAVACH AI FORENSICS - RUNNING UNIT TESTS")
    print("==========================================\n")
    try:
        test_text_classifier()
        test_url_classifier()
        test_audio_classifier()
        test_lipsync_detector()
        test_document_processor()
        test_risk_fusion_complete()
        print("All tests completed successfully!")
    except AssertionError as e:
        print(f"Test failure: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}")
        sys.exit(1)
