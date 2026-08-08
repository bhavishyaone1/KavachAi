import os
import sys
import socket

def check_diagnostics():
    print("==================================================")
    print("KAVACH AI SYSTEM DIAGNOSTIC RUN")
    print("==================================================")
    
    # 1. Check Python Version
    print(f"Python Version: {sys.version}")
    
    # 2. Check Directories & Models
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_files = [
        "face_detection_yunet_2023mar.onnx",
        "cached_text_model.joblib",
        "cached_url_model.joblib",
        "cached_audio_model.joblib",
        "cached_visual_model.joblib"
    ]
    
    print("\n[ Checking Forensic Model Binaries ]")
    for f in model_files:
        path = os.path.join(base_dir, "backend", "models", f)
        exists = os.path.exists(path)
        status = "FOUND" if exists else "NOT FOUND (Will retrain on boot or fallback)"
        print(f" - {f}: {status}")
        
    # 3. Check Temp Dir Write Access
    temp_dir = os.path.join(base_dir, "backend", "temp_uploads")
    print("\n[ Checking Temporary Storage ]")
    print(f"Path: {temp_dir}")
    if os.path.exists(temp_dir):
        try:
            test_file = os.path.join(temp_dir, "test_write.tmp")
            with open(test_file, "w") as f:
                f.write("test")
            os.remove(test_file)
            print(" - Write Access: OK")
        except Exception as e:
            print(f" - Write Access: FAILED ({e})")
    else:
        print(" - Temp Directory: MISSING")
        
    # 4. Check Package Imports
    print("\n[ Checking Required Python Libraries ]")
    packages = ["fastapi", "uvicorn", "sklearn", "numpy", "scipy", "PIL", "joblib"]
    for pkg in packages:
        try:
            __import__(pkg)
            print(f" - {pkg}: INSTALLED")
        except ImportError:
            print(f" - {pkg}: MISSING")
            
    # 5. Check Local API Port
    print("\n[ Checking Local Network Bindings ]")
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(1.0)
    try:
        s.connect(("127.0.0.1", 8000))
        print(" - Local API Server (Port 8000): RUNNING & REACHABLE")
    except Exception:
        print(" - Local API Server (Port 8000): NOT REACHABLE (Check if uvicorn is started)")
    finally:
        s.close()
        
    print("==================================================")

if __name__ == "__main__":
    check_diagnostics()
