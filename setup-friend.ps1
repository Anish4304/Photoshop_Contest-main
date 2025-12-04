# Quick Setup Script for Photography Contest System
# Run this on your friend's laptop

Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Photography Contest System - Setup Wizard          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Check Node.js
Write-Host "1. Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   ✓ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Node.js not found!" -ForegroundColor Red
    Write-Host "   → Download from: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Check if in correct directory
Write-Host "`n2. Checking project structure..." -ForegroundColor Yellow
if (!(Test-Path "backend") -or !(Test-Path "package.json")) {
    Write-Host "   ✗ Not in project root directory!" -ForegroundColor Red
    Write-Host "   → Navigate to Photoshop_Contest folder first" -ForegroundColor Yellow
    exit 1
}
Write-Host "   ✓ Project structure found" -ForegroundColor Green

# Check .env file
Write-Host "`n3. Checking configuration files..." -ForegroundColor Yellow
if (!(Test-Path "backend\.env")) {
    Write-Host "   ✗ backend\.env file missing!" -ForegroundColor Red
    Write-Host "   → Creating .env file..." -ForegroundColor Yellow
    
    $envContent = @"
PORT=5000
MONGODB_URI=mongodb+srv://anishapoojari432004_db_user:me5gkaY0xSNbUf0g@cluster0.3nayjji.mongodb.net/photography_contest?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=ykvjfhiadfushgncuifdnhcggfduigvhngfuijkghnvguifdvnhguiofjnhvd
JWT_EXPIRE=7d
NODE_ENV=development

# Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
"@
    
    Set-Content -Path "backend\.env" -Value $envContent
    Write-Host "   ✓ Created backend\.env file" -ForegroundColor Green
} else {
    Write-Host "   ✓ backend\.env file exists" -ForegroundColor Green
}

# Install dependencies
Write-Host "`n4. Installing dependencies..." -ForegroundColor Yellow
Write-Host "   → Installing root dependencies..." -ForegroundColor Cyan
npm install --silent
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Root dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ✗ Failed to install root dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "   → Installing backend dependencies..." -ForegroundColor Cyan
Set-Location backend
npm install --silent
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ✗ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}
Set-Location ..

# Test MongoDB connection
Write-Host "`n5. Testing MongoDB connection..." -ForegroundColor Yellow
Write-Host "   → This may take up to 10 seconds..." -ForegroundColor Cyan
Set-Location backend
$testResult = node test-connection.js 2>&1
Set-Location ..

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ MongoDB connection successful!" -ForegroundColor Green
} else {
    Write-Host "   ✗ MongoDB connection failed!" -ForegroundColor Red
    Write-Host "`n   Error output:" -ForegroundColor Yellow
    Write-Host $testResult -ForegroundColor Red
    Write-Host "`n   📖 Check DATABASE_TROUBLESHOOTING.md for solutions" -ForegroundColor Yellow
    
    $continue = Read-Host "`n   Continue setup anyway? (y/n)"
    if ($continue -ne "y") {
        exit 1
    }
}

# Check IP whitelist
Write-Host "`n6. Checking IP address..." -ForegroundColor Yellow
try {
    $myIP = (Invoke-RestMethod -Uri "https://api.ipify.org").Trim()
    Write-Host "   → Your public IP: $myIP" -ForegroundColor Cyan
    Write-Host "   → Ensure this IP is whitelisted in MongoDB Atlas" -ForegroundColor Yellow
    Write-Host "   → OR whitelist 0.0.0.0/0 to allow all IPs" -ForegroundColor Yellow
} catch {
    Write-Host "   ⚠ Could not detect IP (might be offline)" -ForegroundColor Yellow
}

# Success
Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              ✓ Setup Complete!                        ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "🚀 To start the application:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Terminal 1 - Backend:" -ForegroundColor Yellow
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "   Terminal 2 - Frontend:" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "   Then open: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""

# Ask if user wants to start now
$startNow = Read-Host "Start backend server now? (y/n)"
if ($startNow -eq "y") {
    Write-Host "`nStarting backend server..." -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop`n" -ForegroundColor Yellow
    Start-Sleep -Seconds 1
    Set-Location backend
    npm run dev
}
