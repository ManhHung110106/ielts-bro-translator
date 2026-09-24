@echo off
title IELTS Bro UI Translator
cd /d "%~dp0"

:: Check administrator privileges
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [THONG BAO] Yeu cau quyen Administrator de chinh sua file trong Program Files.
    echo Dang tu dong xin quyen Run as Administrator...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

:: Terminate any existing gui_server instance
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :38292 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1

:: Start GUI background server
start /b "" node gui_server.js

:: Wait a brief moment for the server to start
powershell -Command "Start-Sleep -Milliseconds 600"

:: Open in App Window Mode (Edge, Chrome, or default browser)
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app="http://127.0.0.1:38292"
) else if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app="http://127.0.0.1:38292"
) else (
    start "" "http://127.0.0.1:38292"
)

exit