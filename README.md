# Kavach AI — Multimodal Cyber Forensics Platform

Kavach AI is an all-in-one digital forensics and fraud intelligence platform. It scans digital assets to detect fake images, deepfake videos, cloned voices, phishing links, scam text messages, and forged documents in a single unified interface.

---

## ⚡ Quick Start (2-Minute Setup)

Get the platform running locally in three steps:

### 1. Install Dependencies
```bash
# Install Python packages
pip install -r backend/requirements.txt

# Install Frontend packages
cd frontend
npm install
```

### 2. Launch the Platform
Run these commands in separate terminal windows:
```bash
# Start Backend API Server (Port 8000)
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload

# Start Frontend UI Client (Port 5173)
cd frontend
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 3. Run System Diagnostics & Verification
Run these verification scripts to check system health:
```bash
# 1. Verify API endpoints regression
python backend/test_endpoints.py

# 2. Run system diagnostic configurations sweep
python backend/check_env_diagnostics.py
```

---

## 🛠️ Forensic Modalities & Engines

Kavach AI splits analysis across six specialized engines:

| Engine | Inputs Scanned | Core Algorithm | Target Detection |
| :--- | :--- | :--- | :--- |
| 💬 **Text** | SMS / WhatsApp Scripts | Logistic Regression | Hinglish scam keywords & bank alerts |
| 🔗 **URL** | Web Links / Domains | Random Forest | Typosquatting brand distance & Punycode |
| 🔊 **Audio** | WAV / MP3 / Voice notes | Random Forest | Synthetic AI voice clones & monotone vocoders |
| 🖼️ **Image** | JPEG / PNG Uploads | Random Forest + ELA | Localized image splicing & AI inpainting |
| 🎥 **Video** | MP4 / AVI / WebM | SyncNet Correlation | Face deepfakes & timeline mouth-to-audio drift |
| 📄 **Document** | EML Emails / PDFs | Header Audit Parser | Display-name bank spoofs & embedded UPIs |

---

## 🔗 Cross-Modal Risk Amplification Matrix

The Risk Fusion Layer applies multiplier penalties when threats co-occur in different channels:

| Modality A | Modality B | Amplification Rule | Fused Risk Penalty |
| :--- | :--- | :--- | :--- |
| **Cloned Voice** | **Urgent Text Script** | Imminent social engineering threat (Distress call) | **Risk boosted to 95%+** |
| **Phishing Link** | **SMS Bank Alert** | Bank account credential phishing campaign | **Risk boosted to 90%+** |
| **Tampered ELA Image** | **Email Mismatch** | Financial document forgery & payment redirection | **Risk boosted to 85%+** |

---

## 💻 Developer API Integration Snippet

Integrate Kavach AI into your custom workflows using Python:

```python
import requests

url = "http://127.0.0.1:8000/api/detect/fuse"

# Example 1: Scan Suspicious Script & Phishing Link
payload = {
    "text": "Dear customer, SBI account blocked. Visit http://sbi-unfreeze.xyz",
    "url": "http://sbi-unfreeze.xyz",
    "filename": "sms_log.txt"
}

response = requests.post(url, data=payload)
if response.status_code == 200:
    results = response.json()
    print(f"Overall Fraud Risk: {results['Overall Fraud Risk']}%")
    print(f"PIB/RBI Match Verdict: {results['Claim Verification Result']}")
    print(f"Threat Flag Reasons: {results['Reasons']}")
```

---

## 🔒 Security Protections

* **No Path Traversal**: Uploaded files are renamed using dynamic `uuid.uuid4()` tokens, preventing malicious file system navigation.
* **Garbage Collection**: Temporary files are deleted immediately after execution inside safe `finally` blocks.
* **No SQL Injection**: Claims verification is processed in-memory using vector search algorithms (no database queries are compiled via raw text).
* **XSS Immune**: React natively escapes user inputs in JSX blocks (no `dangerouslySetInnerHTML` is used).
* **Timeout Bounds**: DNS check threads timeout after `2.5` seconds, protecting server worker pools from exhaustion.

---

## 🛠️ Troubleshooting & Environment FAQ

| Issue Identified | Probable Cause | Immediate Resolution |
| :--- | :--- | :--- |
| `Uvicorn Port 8000 already in use` | A background uvicorn server process is still running. | Run `Stop-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess` in PowerShell to kill the process. |
| `ModuleNotFoundError: sklearn` | Dependencies are not installed in the active python context. | Run `pip install -r backend/requirements.txt` to install the requirements. |
| `FFmpeg not found in environment` | ffmpeg executable is missing from the system PATH. | The lipsync detector automatically falls back to default timeline mock correlations gracefully. |
