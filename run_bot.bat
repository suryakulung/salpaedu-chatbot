@echo off
cd /d "%~dp0"
echo ===================================================
echo      Starting AI Chatbot (Attempt 3)
echo ===================================================

echo 1. Stopping any old processes...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM mongod.exe 2>nul
timeout /t 2 >nul

echo 2. Starting Database...
start "MongoDB" cmd /k "call start_db.bat || pause"

echo Waiting 5 seconds for DB to start...
timeout /t 5 >nul

echo 3. Starting Backend...
start "Backend" cmd /k "cd server && echo Starting Server... && npm run dev || pause"

echo 4. Starting Admin Panel...
start "Admin" cmd /k "cd admin && echo Starting Admin... && npm run dev || pause"

echo.
echo ===================================================
echo             DONE!
echo ===================================================
echo If windows appear and close immediately,
echo please tell the AI agent.
pause
