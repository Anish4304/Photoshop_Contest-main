# Photography Contest Management System - Startup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Photography Contest Management System" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check MongoDB
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
if ($mongoService -eq $null) {
    Write-Host "MongoDB service not found!" -ForegroundColor Red
    Write-Host "Please install MongoDB first." -ForegroundColor Red
    exit 1
}

if ($mongoService.Status -ne "Running") {
    Write-Host "Starting MongoDB..." -ForegroundColor Yellow
    Start-Service MongoDB
    Start-Sleep -Seconds 2
}

Write-Host "MongoDB is running!" -ForegroundColor Green
Write-Host ""

# Start Backend
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host 'Backend Server' -ForegroundColor Cyan; npm run dev"

Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start Frontend
Write-Host "Starting Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; Write-Host 'Frontend Server' -ForegroundColor Cyan; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Project Started Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
