---
name: kavach-forensics
description: Instructions, training workflows, and verification procedures for the Kavach AI Multimodal Fraud Intelligence Platform.
---

# Kavach AI Forensics Guide

This workspace skill provides operational instructions and scripts for managing, retraining, and testing the **Kavach AI Platform** components.

---

## 1. Directory Structure

- `/backend/main.py`: FastAPI server gate coordinator.
- `/backend/models/text_detector.py`: Logistic Regression classifier for 13 multiclass scam labels.
- `/backend/models/url_detector.py`: Random Forest lexical features link scanner.
- `/backend/models/audio_detector.py`: DSP extractor and vocal spoof Random Forest classifier.
- `/backend/models/lipsync_detector.py`: Video-to-audio timeline lag analyzer utilizing FFmpeg.
- `/backend/utils/document_processor.py`: PyMuPDF layout parser and email header checker.
- `/backend/models/claim_verifier.py`: Local TF-IDF cosine-similarity RAG verification index.
- `/backend/models/fusion_risk.py`: Unified fusion layer that returns the 29-field SIH fraud report.
- `/frontend/src/App.jsx`: Glassmorphic React dashboard styled with Framer Motion.

---

## 2. CLI Execution Guides

### 2.1 Complete End-to-End Retraining
To delete cached model weights and trigger a clean training loop across NLP, audio waves, and lexical URL classifiers:
```powershell
# Run from repository root
Remove-Item backend/models/cached_*.joblib -ErrorAction SilentlyContinue; python backend/test_endpoints.py
```

### 2.2 Verification Tests
Run automated unit tests to verify prediction bounds and categorizations:
```powershell
python backend/test_endpoints.py
```

Run detailed signal processing (DSP) verification on generated WAV profiles:
```powershell
python backend/test_audio_dsp.py
```

---

## 3. Starting the Running Servers

Start the FastAPI gateway:
```powershell
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

Start the Vite React server:
```powershell
cd frontend
npm run dev
```

---

## 4. Multi-Modal Fusion Schema (29 Root Fields)
The fusion layer returns a JSON payload mapping parameters to these root fields:
1. `Overall Fraud Risk`
2. `Visual Deepfake Score`
3. `AI Image Score`
4. `Image Manipulation Score`
5. `Pixel Manipulation Evidence`
6. `Audio Deepfake Score`
7. `Voice Clone Score`
8. `Lip-Sync Anomaly`
9. `Scam Probability`
10. `Scam Category`
11. `URL Risk`
12. `Website Risk`
13. `QR Risk`
14. `Payment/UPI Risk`
15. `Document Risk`
16. `Email Risk`
17. `Claim Verification Result` (SUPPORTED, CONTRADICTED, INSUFFICIENT EVIDENCE)
18. `Threat Intelligence Results`
19. `Suspicious Text`
20. `Suspicious URLs`
21. `Suspicious Identifiers`
22. `Suspicious Video Frames`
23. `Suspicious Timestamps`
24. `Metadata Findings`
25. `Verification Sources`
26. `Evidence`
27. `Reasons`
28. `Confidence / Uncertainty`
29. `Recommended Action`
