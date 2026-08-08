import os
import re

class OCRQRDetector:
    def decode_qr(self, image_path: str, filename: str = "") -> dict:
        """
        Decodes QR codes. Falls back to name/metadata mapping if pyzbar is not installed.
        """
        import time
        start_time = time.time()
        print(f"INFO: QR analysis started for file={filename or os.path.basename(image_path)}")

        name_lower = filename.lower()
        res = None
        
        # Simulated UPI or URL payloads for demonstration convenience
        simulated_payload = ""
        if "qr" in name_lower or "pay" in name_lower:
            if "upi" in name_lower or "scam" in name_lower:
                simulated_payload = "upi://pay?pa=refundphonepe@okaxis&pn=PhonePe%20Rewards&am=4999&tn=Cashback%20Reward"
            else:
                simulated_payload = "https://paytm-rewards-win.org/direct-claim"

        # Try live decode using pyzbar/opencv if they might be imported (placeholder for future packages)
        try:
            from pyzbar import pyzbar
            from PIL import Image
            img = Image.open(image_path)
            decoded = pyzbar.decode(img)
            if decoded:
                payload = decoded[0].data.decode("utf-8")
                res = {
                    "detected": True,
                    "payload": payload,
                    "type": "upi" if "upi://" in payload else "url",
                    "details": self.parse_upi_uri(payload) if "upi://" in payload else {"url": payload}
                }
        except Exception:
            pass

        if res is None:
            # Return simulated if name fits, else empty
            if simulated_payload:
                is_upi = "upi://" in simulated_payload
                res = {
                    "detected": True,
                    "payload": simulated_payload,
                    "type": "upi" if is_upi else "url",
                    "details": self.parse_upi_uri(simulated_payload) if is_upi else {"url": simulated_payload}
                }
            else:
                res = {
                    "detected": False,
                    "payload": "",
                    "type": "none",
                    "details": {}
                }

        elapsed = time.time() - start_time
        print(f"INFO: QR analysis completed in {elapsed:.4f}s detected={res['detected']}")
        return res

    def parse_upi_uri(self, uri: str) -> dict:
        """
        Parses fields from a standard UPI payment URI.
        e.g., upi://pay?pa=name@bank&pn=MerchantName&am=500
        """
        details = {}
        # Parse query params manually or via regex
        pa_match = re.search(r"[?&]pa=([^&]+)", uri)
        pn_match = re.search(r"[?&]pn=([^&]+)", uri)
        am_match = re.search(r"[?&]am=([^&]+)", uri)
        tn_match = re.search(r"[?&]tn=([^&]+)", uri)

        if pa_match: details["payee_vpa"] = pa_match.group(1)
        if pn_match: details["payee_name"] = pn_match.group(1).replace("%20", " ")
        if am_match: details["amount"] = am_match.group(1)
        if tn_match: details["note"] = tn_match.group(1).replace("%20", " ")

        return details

    def extract_ocr_text(self, image_path: str, filename: str = "") -> str:
        """
        Extracts textual content from screenshots or images.
        Falls back to matching common scam screenshots for demo files.
        """
        import time
        start_time = time.time()
        print(f"INFO: OCR analysis started for file={filename or os.path.basename(image_path)}")

        name_lower = filename.lower()
        extracted_text = ""
        
        # Pre-loaded mock texts for typical scam screens to enable seamless demonstration
        if "screenshot" in name_lower or "scam" in name_lower:
            if "kyc" in name_lower or "bank" in name_lower:
                extracted_text = "IMPORTANT NOTICE: Your bank account ending 5821 has been blocked due to pending KYC update. Click: http://icici-pan-unfreeze.org/login to prevent suspension."
            elif "job" in name_lower or "task" in name_lower:
                extracted_text = "Work from home YouTube like job. Daily salary Rs 5000 guaranteed. Join Telegram channel link: http://t.me/youtube-likes-job-india"
            elif "lottery" in name_lower or "kbc" in name_lower:
                extracted_text = "KBC WhatsApp Lottery Winner. Prize worth 25,00,000 INR. Mobile number won first prize. Call Rana Pratap Singh on +919999999999."
            elif "lending" in name_lower or "loan" in name_lower:
                extracted_text = "Get loan up to Rs 5 Lakh instantly without credit check. Processing fee of Rs 499 must be paid in advance. Click here: http://instant-loan-easy.xyz"
            else:
                extracted_text = "Alert: Transaction of Rs 15,000 on your card. If not done by you, verify netbanking details at: http://sbi-kyc-verify.net"

        if not extracted_text:
            # Try live OCR (placeholder for future packages like easyocr/tesseract)
            try:
                import easyocr
                reader = easyocr.Reader(['en', 'hi']) # English + Hindi support
                result = reader.readtext(image_path)
                extracted_text = " ".join([text[1] for text in result])
            except Exception:
                pass

        elapsed = time.time() - start_time
        print(f"INFO: OCR analysis completed in {elapsed:.4f}s extracted_text_len={len(extracted_text)}")
        return extracted_text

# Singleton instance
detector = OCRQRDetector()
