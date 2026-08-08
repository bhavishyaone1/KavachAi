@echo off
title Kavach AI Launcher
echo ========================================================
echo   KAVACH AI - MULTIMODAL FORENSICS PLATFORM
echo ========================================================
echo.
echo [1/3] Checking environment & training models...
python backend/check_env_diagnostics.py

echo.
echo [2/3] Starting Backend API Server (Port 8000)...
start "Kavach AI Backend" cmd /k "python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

echo.
echo [3/3] Starting Frontend Web Dashboard (Port 5173)...
start "Kavach AI Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 3 >nul
echo.
echo Opening Dashboard in browser...
start http://localhost:5173/

echo.
echo ========================================================
echo   Kavach AI is now live at http://localhost:5173/
echo ========================================================
