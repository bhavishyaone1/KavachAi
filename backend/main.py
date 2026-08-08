import os
import shutil
import uuid
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

# Import models
from backend.models.text_detector import detector as text_detector
from backend.models.audio_detector import detector as audio_detector
from backend.models.url_detector import detector as url_detector
from backend.models.video_detector import detector as visual_detector
from backend.models.claim_verifier import claim_verifier
from backend.models.ocr_qr_detector import detector as ocr_qr_detector
from backend.models.fusion_risk import fusion_layer
from backend.utils.document_processor import document_processor
from backend.models.lipsync_detector import detector as lipsync_detector

app = FastAPI(
    title="Kavach AI Fraud Intelligence Platform",
    description="Multi-modal verification engine for detecting deepfakes, synthetic media, and cyber-scams in an Indian context.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "temp_uploads")
os.makedirs(TEMP_DIR, exist_ok=True)

class TextRequest(BaseModel):
    text: str

class URLRequest(BaseModel):
    url: str

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "service": "Kavach AI Multimodal Fraud Intelligence Engine",
        "engine_version": "1.0.0"
    }

@app.post("/api/detect/text")
def detect_text(payload: TextRequest):
    try:
        text_res = text_detector.analyze(payload.text)
        claim_res = claim_verifier.verify_claims(payload.text)
        
        # Merge claim verifier output for text audit
        fused = fusion_layer.fuse_results(
            text_res=text_res,
            claim_res=claim_res
        )
        return fused
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/detect/url")
def detect_url(payload: URLRequest):
    try:
        url_res = url_detector.analyze(payload.url)
        fused = fusion_layer.fuse_results(
            url_res=url_res
        )
        return fused
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/detect/audio")
async def detect_audio(file: UploadFile = File(...)):
    file_ext = os.path.splitext(file.filename)[1]
    temp_file_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}{file_ext}")
    
    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        audio_res = audio_detector.analyze(temp_file_path, file.filename)
        
        fused = fusion_layer.fuse_results(
            audio_res=audio_res,
            filename=file.filename
        )
        return fused
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception as ce:
                print(f"Error cleaning up temp file: {ce}")

@app.post("/api/detect/visual")
async def detect_visual(file: UploadFile = File(...)):
    file_ext = os.path.splitext(file.filename)[1]
    temp_file_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}{file_ext}")
    
    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # 1. Image checks: QR & OCR
        qr_res = ocr_qr_detector.decode_qr(temp_file_path, file.filename)
        ocr_text = ocr_qr_detector.extract_ocr_text(temp_file_path, file.filename)
        
        text_res = None
        claim_res = None
        url_res = None
        sync_res = None
        
        if ocr_text:
            text_res = text_detector.analyze(ocr_text)
            claim_res = claim_verifier.verify_claims(ocr_text)
            
        if qr_res.get("detected") and qr_res["type"] == "url":
            url_res = url_detector.analyze(qr_res["payload"])

        # 2. Visual Forensics (Error Level Analysis / Codec trace)
        visual_res = visual_detector.analyze(temp_file_path, file.filename)
        
        # 3. Audio Lip-Sync correlation if visual is video
        if visual_res.get("type") == "video":
            sync_res = lipsync_detector.estimate_sync(temp_file_path)
            
        # Fusion
        fused = fusion_layer.fuse_results(
            text_res=text_res,
            url_res=url_res,
            visual_res=visual_res,
            claim_res=claim_res,
            qr_res=qr_res,
            sync_res=sync_res,
            filename=file.filename
        )
        return fused
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception as ce:
                print(f"Error cleaning up temp file: {ce}")

@app.post("/api/detect/document")
async def detect_document(file: UploadFile = File(...)):
    file_ext = os.path.splitext(file.filename)[1]
    temp_file_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}{file_ext}")
    
    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        doc_res = document_processor.process_document(temp_file_path, file.filename)
        
        text_res = None
        claim_res = None
        url_res = None
        
        if doc_res["text"]:
            text_res = text_detector.analyze(doc_res["text"])
            claim_res = claim_verifier.verify_claims(doc_res["text"])
            
        if doc_res["links"]:
            url_res = url_detector.analyze(doc_res["links"][0])
            
        fused = fusion_layer.fuse_results(
            text_res=text_res,
            url_res=url_res,
            claim_res=claim_res,
            document_res=doc_res,
            filename=file.filename
        )
        return fused
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception as ce:
                print(f"Error cleaning up temp file: {ce}")

@app.post("/api/detect/fuse")
async def detect_fuse(
    text: Optional[str] = Form(None),
    url: Optional[str] = Form(None),
    audio_file: Optional[UploadFile] = File(None),
    visual_file: Optional[UploadFile] = File(None),
    document_file: Optional[UploadFile] = File(None)
):
    print(f"DEBUG INPUT: detect_fuse received text={repr(text)}, url={repr(url)}, audio={audio_file.filename if audio_file else None}, visual={visual_file.filename if visual_file else None}")
    temp_audio_path = None
    temp_visual_path = None
    temp_doc_path = None
    
    try:
        text_res = None
        url_res = None
        audio_res = None
        visual_res = None
        claim_res = None
        qr_res = None
        document_res = None
        sync_res = None

        # 1. Process Text Input
        if text:
            text_res = text_detector.analyze(text)
            claim_res = claim_verifier.verify_claims(text)

        # 2. Process URL Input
        if url:
            url_res = url_detector.analyze(url)
            
        # Extract and parse URL from text if no explicit URL was provided
        if text and not url:
            urls = text_detector.analyze(text).get("urls", [])
            if urls:
                url_res = url_detector.analyze(urls[0])

        # 3. Process Audio Upload
        if audio_file:
            file_ext = os.path.splitext(audio_file.filename)[1]
            temp_audio_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}{file_ext}")
            with open(temp_audio_path, "wb") as buffer:
                shutil.copyfileobj(audio_file.file, buffer)
            
            audio_res = audio_detector.analyze(temp_audio_path, audio_file.filename)

        # 4. Process Visual Upload (Image/Video)
        if visual_file:
            file_ext = os.path.splitext(visual_file.filename)[1]
            temp_visual_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}{file_ext}")
            with open(temp_visual_path, "wb") as buffer:
                shutil.copyfileobj(visual_file.file, buffer)
            
            # QR & OCR checks on uploaded visual assets
            qr_res = ocr_qr_detector.decode_qr(temp_visual_path, visual_file.filename)
            ocr_text = ocr_qr_detector.extract_ocr_text(temp_visual_path, visual_file.filename)
            
            if ocr_text and not text_res:
                text_res = text_detector.analyze(ocr_text)
                claim_res = claim_verifier.verify_claims(ocr_text)
                
            if qr_res.get("detected") and qr_res["type"] == "url" and not url_res:
                url_res = url_detector.analyze(qr_res["payload"])

            visual_res = visual_detector.analyze(temp_visual_path, visual_file.filename)
            
            # Lip-Sync correlation logic for video files
            if visual_res.get("type") == "video":
                sync_res = lipsync_detector.estimate_sync(temp_visual_path)

        # 5. Process Document Upload
        if document_file:
            file_ext = os.path.splitext(document_file.filename)[1]
            temp_doc_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}{file_ext}")
            with open(temp_doc_path, "wb") as buffer:
                shutil.copyfileobj(document_file.file, buffer)
                
            document_res = document_processor.process_document(temp_doc_path, document_file.filename)
            
            if document_res["text"] and not text_res:
                text_res = text_detector.analyze(document_res["text"])
                claim_res = claim_verifier.verify_claims(document_res["text"])
                
            if document_res["links"] and not url_res:
                url_res = url_detector.analyze(document_res["links"][0])

        # 6. Perform Fusion
        fused = fusion_layer.fuse_results(
            text_res=text_res,
            url_res=url_res,
            audio_res=audio_res,
            visual_res=visual_res,
            claim_res=claim_res,
            qr_res=qr_res,
            document_res=document_res,
            sync_res=sync_res,
            filename=visual_file.filename if visual_file else (audio_file.filename if audio_file else (document_file.filename if document_file else ""))
        )
        print(f"DEBUG OUTPUT: detect_fuse returning risk={fused.get('Overall Fraud Risk')}% reasons={fused.get('Reasons')}")
        return fused

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        for path in [temp_audio_path, temp_visual_path, temp_doc_path]:
            if path and os.path.exists(path):
                try:
                    os.remove(path)
                except Exception as ce:
                    print(f"Error cleaning up temp file: {ce}")

# Mount static frontend build if present
frontend_dist = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend", "dist")
if os.path.exists(frontend_dist):
    from fastapi.staticfiles import StaticFiles
    from fastapi.responses import FileResponse, JSONResponse

    @app.exception_handler(404)
    async def custom_404_handler(request, exc):
        index_path = os.path.join(frontend_dist, "index.html")
        if os.path.exists(index_path) and not request.url.path.startswith("/api"):
            return FileResponse(index_path)
        return JSONResponse(status_code=404, content={"detail": "Not Found"})

    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
