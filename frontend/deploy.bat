@echo off
REM Copy built frontend to backend automatically
REM This script should be run from the frontend folder

echo.
echo ================================
echo Frontend to Backend Deployment
echo ================================
echo.

REM Get the script directory
for /f %%i in ("%~dp0.") do set "frontend_dir=%%~fi"
for /f %%i in ("%frontend_dir%..") do set "parent_dir=%%~fi"
set "backend_dir=%parent_dir%\backend"

echo Frontend Directory: %frontend_dir%
echo Backend Directory: %backend_dir%
echo.

REM Check if dist folder exists
if not exist "%frontend_dir%\dist" (
    echo ERROR: dist folder not found!
    echo Run: npm run build
    pause
    exit /b 1
)

REM Check if backend exists
if not exist "%backend_dir%" (
    echo ERROR: Backend folder not found at %backend_dir%
    pause
    exit /b 1
)

REM Copy dist folder
echo Copying dist folder to backend...
xcopy "%frontend_dir%\dist" "%backend_dir%\dist" /E /Y /I

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ SUCCESS! Frontend copied to backend
    echo.
    echo Next steps:
    echo 1. cd ..\backend
    echo 2. npm start
    echo 3. Visit http://localhost:5000
    echo.
) else (
    echo ERROR: Failed to copy files
    pause
    exit /b 1
)

pause
