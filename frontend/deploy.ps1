# Copy built frontend to backend
# Run this from the frontend folder: .\deploy.ps1

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Frontend to Backend Deployment" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Get paths
$frontend_dir = Get-Location
$backend_dir = Split-Path $frontend_dir | Join-Path -ChildPath "backend"
$dist_folder = Join-Path $frontend_dir "dist"

Write-Host "Frontend: $frontend_dir"
Write-Host "Backend:  $backend_dir"
Write-Host ""

# Validate dist folder
if (-not (Test-Path $dist_folder)) {
    Write-Host "ERROR: dist folder not found!" -ForegroundColor Red
    Write-Host "Run: npm run build" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Validate backend folder
if (-not (Test-Path $backend_dir)) {
    Write-Host "ERROR: Backend folder not found at $backend_dir" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Copy files
Write-Host "Copying dist folder to backend..." -ForegroundColor Yellow
$backend_dist = Join-Path $backend_dir "dist"

# Remove old dist if exists
if (Test-Path $backend_dist) {
    Remove-Item $backend_dist -Recurse -Force
    Write-Host "Removed old dist folder"
}

# Copy new dist
Copy-Item -Path $dist_folder -Destination $backend_dist -Recurse

if ($?) {
    Write-Host ""
    Write-Host "SUCCESS! Frontend copied to backend" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. cd ..\backend"
    Write-Host "  2. npm start"
    Write-Host "  3. Visit http://localhost:5000"
    Write-Host ""
    Read-Host "Press Enter to exit"
} else {
    Write-Host "ERROR: Failed to copy files" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
