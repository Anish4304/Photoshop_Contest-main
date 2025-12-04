@echo off
echo 🚀 Starting Photography Contest Application with MongoDB Atlas...
echo.

echo 📡 Starting Backend Server...
start "Photography Contest Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo 🎨 Starting Frontend Application...
start "Photography Contest Frontend" cmd /k "npm run dev"

echo.
echo ✅ Application started!
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend: http://localhost:5000
echo.
echo 🔐 Demo Accounts:
echo Admin: admin@example.com / password123
echo Photographer: sarah@example.com / password123
echo Judge: judge@example.com / password123
echo.
echo 📊 Features Available:
echo - Photo upload and management
echo - Judge scoring system
echo - Visitor voting
echo - Winners calculation
echo - Admin dashboard with analytics
echo.
echo Press any key to open frontend in browser...
pause > nul
start http://localhost:5173