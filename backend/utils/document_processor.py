import os
import re
import fitz  # PyMuPDF
import email
from email import policy

# Regex extractors
EMAIL_REGEX = re.compile(r"[a-zA-Z0-9.\-_]+@[a-zA-Z0-9.\-_]+\.[a-zA-Z]{2,10}")
PHONE_REGEX = re.compile(r"\+?91[6-9]\d{9}\b|\b[6-9]\d{9}\b")
UPI_REGEX = re.compile(r"[a-zA-Z0-9.\-_]{2,256}@(okaxis|okicici|oksbi|paytm|ybl|apl|upi|yapl|okhdfcbank|okaxis|icici|barodampay|dlb|axl|fifederal|axisbank|payzapp|hsbc)")

class DocumentProcessor:
    def parse_pdf(self, file_path: str) -> dict:
        """
        Parses PDF files using PyMuPDF to extract text, embedded hyperlink URIs, and metadata tags.
        Also scans embedded images for ELA compression manipulation bounds.
        """
        text = ""
        links = []
        metadata = {}
        flags = []
        try:
            doc = fitz.open(file_path)
            metadata = dict(doc.metadata) if doc.metadata else {}
            
            # Read first 15 pages maximum to limit heavy file processing lag
            page_count = min(len(doc), 15)
            for i in range(page_count):
                page = doc.load_page(i)
                text += page.get_text()
                
                # Extract links
                page_links = page.get_links()
                for link in page_links:
                    if "uri" in link:
                        links.append(link["uri"])
                
                # Extract and scan embedded images for digital tamper boundaries
                try:
                    image_list = page.get_images(full=True)
                    for img_info in image_list[:5]:  # limit to first 5 images to prevent lag
                        xref = img_info[0]
                        base_image = doc.extract_image(xref)
                        image_bytes = base_image["image"]
                        
                        temp_img_path = file_path + f"_embedded_{xref}.jpg"
                        with open(temp_img_path, "wb") as f_img:
                            f_img.write(image_bytes)
                            
                        try:
                            try:
                                from backend.models.video_detector import detector as visual_detector
                            except ImportError:
                                from models.video_detector import detector as visual_detector
                            ela_res = visual_detector.perform_ela(temp_img_path)
                            if ela_res["score"] > 0.45:
                                flags.append("embedded_image_tampered")
                        except Exception:
                            pass
                        finally:
                            if os.path.exists(temp_img_path):
                                os.remove(temp_img_path)
                except Exception as e:
                    print(f"Failed to scan embedded PDF images: {e}")
                    
            doc.close()
        except Exception as e:
            print(f"PyMuPDF extraction failed for {file_path}: {e}")
            
        return {
            "text": text,
            "links": list(set(links)),
            "metadata": metadata,
            "flags": list(set(flags))
        }

    def parse_eml(self, file_path: str) -> dict:
        """
        Parses EML / MSG raw email text structures to isolate senders, subject headers, and body.
        """
        sender = ""
        reply_to = ""
        subject = ""
        body = ""
        headers = {}
        
        try:
            with open(file_path, "rb") as f:
                msg = email.message_from_binary_file(f, policy=policy.default)
                
            sender = msg.get("From", "")
            reply_to = msg.get("Reply-To", "")
            subject = msg.get("Subject", "")
            
            # Collect interesting headers for spoof checking
            headers = {
                "From": sender,
                "Reply-To": reply_to,
                "Subject": subject,
                "Return-Path": msg.get("Return-Path", ""),
                "Received-SPF": msg.get("Received-SPF", ""),
                "DKIM-Signature": msg.get("DKIM-Signature", "")
            }
            
            if msg.is_multipart():
                for part in msg.walk():
                    content_type = part.get_content_type()
                    content_disposition = str(part.get("Content-Disposition"))
                    
                    if content_type == "text/plain" and "attachment" not in content_disposition:
                        payload = part.get_payload(decode=True)
                        if payload:
                            body += payload.decode("utf-8", errors="ignore")
            else:
                payload = msg.get_payload(decode=True)
                if payload:
                    body = payload.decode("utf-8", errors="ignore")
                    
        except Exception as e:
            print(f"Email parser failed for {file_path}: {e}")
            
        full_text = f"Subject: {subject}\nFrom: {sender}\nBody:\n{body}"
        
        return {
            "text": full_text,
            "sender": sender,
            "reply_to": reply_to,
            "subject": subject,
            "headers": headers
        }

    def parse_csv_or_txt(self, file_path: str) -> str:
        """
        Reads plain text formats like RTF, TXT, CSV.
        """
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()
        except Exception as e:
            print(f"Plain text reader failed for {file_path}: {e}")
            return ""

    def extract_entities(self, text: str) -> dict:
        """
        Finds phone numbers, email addresses, and UPI IDs within arbitrary text.
        """
        if not text:
            return {"phones": [], "emails": [], "upi_ids": []}
            
        phones = PHONE_REGEX.findall(text)
        emails = EMAIL_REGEX.findall(text)
        upi_ids = [match.group(0) for match in UPI_REGEX.finditer(text)]
        
        return {
            "phones": list(set(phones)),
            "emails": list(set(emails)),
            "upi_ids": list(set(upi_ids))
        }

    def process_document(self, file_path: str, filename: str) -> dict:
        """
        Determines file extension and runs the appropriate parser.
        """
        import time
        start_time = time.time()
        print(f"INFO: Document analysis started for file={filename}")

        name_lower = filename.lower()
        text = ""
        links = []
        metadata = {}
        email_info = None

        flags = []
        if name_lower.endswith(".pdf"):
            pdf_data = self.parse_pdf(file_path)
            text = pdf_data["text"]
            links = pdf_data["links"]
            metadata = pdf_data["metadata"]
            flags = pdf_data.get("flags", [])
        elif name_lower.endswith((".eml", ".msg")):
            eml_data = self.parse_eml(file_path)
            text = eml_data["text"]
            email_info = {
                "sender": eml_data["sender"],
                "reply_to": eml_data["reply_to"],
                "subject": eml_data["subject"],
                "headers": eml_data["headers"]
            }
        else:
            text = self.parse_csv_or_txt(file_path)

        entities = self.extract_entities(text)
        
        # Check email headers discrepancy for display-name spoofing
        if email_info:
            sender = email_info["sender"].lower()
            reply_to = email_info["reply_to"].lower()
            if reply_to and reply_to != sender:
                # e.g., 'From: Bank Service <scammer@gmail.com>' but 'Reply-To: refund@scam.com'
                flags.append("email_reply_to_mismatch")
            
            # Simple check for free email addresses impersonating banks
            if "pnb" in sender or "sbi" in sender or "hdfc" in sender or "bank" in sender:
                if "gmail.com" in sender or "yahoo.com" in sender or "outlook.com" in sender:
                    flags.append("free_mail_bank_impersonation")

        elapsed = time.time() - start_time
        print(f"INFO: Document analysis completed in {elapsed:.4f}s links={len(links)} upis={len(entities['upi_ids'])} flags={flags}")

        return {
            "text": text,
            "links": links,
            "metadata": metadata,
            "phones": entities["phones"],
            "emails": entities["emails"],
            "upi_ids": entities["upi_ids"],
            "email_info": email_info,
            "flags": flags
        }

# Singleton instance
document_processor = DocumentProcessor()
