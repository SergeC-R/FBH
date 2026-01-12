@echo off
echo Starting Fasage Lux Landing Page Server...
echo.
echo Server will be available at: http://localhost:8080
echo.
echo Press Ctrl+C to stop the server
echo.
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File server.ps1
pause
