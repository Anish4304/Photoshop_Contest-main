@echo off
echo ========================================
echo Photography Contest Management System
echo ========================================
echo.

echo Checking MongoDB...
sc query MongoDB | find "RUNNING" >nul
if errorlevel 1 (
    echo MongoDB is not running. Starting MongoDB...
    net start MongoDB
    timeout /t 2 >nul
) else (
    echo MongoDB is already running!
)
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0backend && echo Backend Server && npm run dev"
timeout /t 3 >nul

echo Starting Frontend...
start "Frontend" cmd /k "cd /d %~dp0 && echo Frontend && npm run dev"

echo.
echo ========================================
echo Project Started!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause >nul
