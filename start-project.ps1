# Photography Contest Application Startup Script
# This script starts both the backend and frontend servers

Write-Host "🚀 Photography Contest Application Startup" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

# Set environment variables for the backend
Write-Host "`n📝 Setting up environment variables..." -ForegroundColor Yellow
$env:MONGODB_URI = 'mongodb+srv://anishapoojari432004_db_user:me5gkaY0xSNbUf0g@cluster0.3nayjji.mongodb.net/photography_contest?retryWrites=true&w=majority&appName=Cluster0'
$env:PORT = '5000'
$env:JWT_SECRET = 'ykvjfhiadfushgncuifdnhcggfduigvhngfuijkghnvguifdvnhguiofjnhvd'
$env:NODE_ENV = 'development'
Write-Host "✅ Environment variables set" -ForegroundColor Green

# Get the project root
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start backend in a new window
Write-Host "`n🔧 Starting Backend Server (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @"
  `$env:MONGODB_URI = 'mongodb+srv://anishapoojari432004_db_user:me5gkaY0xSNbUf0g@cluster0.3nayjji.mongodb.net/photography_contest?retryWrites=true&w=majority&appName=Cluster0'
  `$env:PORT = '5000'
  `$env:JWT_SECRET = 'ykvjfhiadfushgncuifdnhcggfduigvhngfuijkghnvguiofjnhvd'
  `$env:NODE_ENV = 'development'
  cd '$projectRoot\backend'
  npm run build
  node dist/server.js
  Read-Host 'Press Enter to exit'
"@ -WindowTitle "Photography Contest - Backend"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend in another new window
Write-Host "🎨 Starting Frontend Server (Port 5174)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @"
  cd '$projectRoot'
  npm run dev
  Read-Host 'Press Enter to exit'
"@ -WindowTitle "Photography Contest - Frontend"

Write-Host "`n" -ForegroundColor Cyan
Write-Host "✅ Both servers are starting!" -ForegroundColor Green
Write-Host "`n📌 URLs:" -ForegroundColor Cyan
Write-Host "  🌐 Frontend: http://localhost:5174" -ForegroundColor White
Write-Host "  🔌 Backend API: http://localhost:5000/api" -ForegroundColor White
Write-Host "  ❤️  Health Check: http://localhost:5000/api/health" -ForegroundColor White
Write-Host "`n⚠️  Keep this window open. Close to stop all servers." -ForegroundColor Yellow
Write-Host "=" * 50 -ForegroundColor Cyan

# Keep the main window open
Read-Host "`nPress Enter when done to close this window"
