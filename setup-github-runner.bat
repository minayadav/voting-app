@echo off
echo ================================================
echo  GitHub Actions Self-Hosted Runner Setup
echo  for Local Docker Desktop Deployment
echo ================================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: This script requires Administrator privileges!
    echo Please right-click and select "Run as Administrator"
    pause
    exit /b 1
)

echo Checking prerequisites...
echo.

REM Check Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not in PATH
    echo Please install Docker Desktop first
    pause
    exit /b 1
)
echo ✓ Docker is installed

REM Check Git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed
    echo Please install Git first
    pause
    exit /b 1
)
echo ✓ Git is installed

echo.
echo ================================================
echo  Step 1: Create Runner Directory
echo ================================================
echo.

set RUNNER_DIR=C:\actions-runner
if not exist %RUNNER_DIR% (
    echo Creating directory: %RUNNER_DIR%
    mkdir %RUNNER_DIR%
) else (
    echo Directory already exists: %RUNNER_DIR%
)

cd %RUNNER_DIR%

echo.
echo ================================================
echo  Step 2: Download GitHub Actions Runner
echo ================================================
echo.

set RUNNER_VERSION=2.311.0
set RUNNER_FILE=actions-runner-win-x64-%RUNNER_VERSION%.zip

if exist %RUNNER_FILE% (
    echo Runner package already downloaded
) else (
    echo Downloading runner package...
    powershell -Command "Invoke-WebRequest -Uri 'https://github.com/actions/runner/releases/download/v%RUNNER_VERSION%/%RUNNER_FILE%' -OutFile '%RUNNER_FILE%'"
    
    if %errorlevel% neq 0 (
        echo ERROR: Failed to download runner
        pause
        exit /b 1
    )
    echo ✓ Runner downloaded successfully
)

echo.
echo ================================================
echo  Step 3: Extract Runner Package
echo ================================================
echo.

if exist config.cmd (
    echo Runner already extracted
) else (
    echo Extracting runner...
    powershell -Command "Expand-Archive -Path '%RUNNER_FILE%' -DestinationPath '%RUNNER_DIR%' -Force"
    echo ✓ Runner extracted successfully
)

echo.
echo ================================================
echo  Step 4: Configure Runner
echo ================================================
echo.
echo IMPORTANT: You need to get a token from GitHub!
echo.
echo Please follow these steps:
echo   1. Open your browser and go to:
echo      https://github.com/YOUR_USERNAME/voting-app-microservices/settings/actions/runners/new
echo.
echo   2. Select "Windows" as the operating system
echo.
echo   3. Copy the TOKEN shown in the "Configure" section
echo      (It looks like: AAAA...)
echo.
echo   4. Come back here and paste it below
echo.
pause

set /p GITHUB_TOKEN="Paste your GitHub token here: "
set /p GITHUB_REPO_URL="Enter your repository URL (e.g., https://github.com/username/voting-app-microservices): "

echo.
echo Configuring runner...
config.cmd --url %GITHUB_REPO_URL% --token %GITHUB_TOKEN% --name "local-docker-desktop" --work "_work" --runasservice

if %errorlevel% neq 0 (
    echo ERROR: Failed to configure runner
    pause
    exit /b 1
)

echo ✓ Runner configured successfully

echo.
echo ================================================
echo  Step 5: Install and Start Runner Service
echo ================================================
echo.

echo Installing runner as Windows service...
svc.cmd install

if %errorlevel% neq 0 (
    echo WARNING: Service installation may have failed
    echo You may need to run this manually
)

echo.
echo Starting runner service...
svc.cmd start

if %errorlevel% neq 0 (
    echo ERROR: Failed to start service
    pause
    exit /b 1
)

echo.
echo Checking service status...
svc.cmd status

echo.
echo ================================================
echo  ✅ Setup Complete!
echo ================================================
echo.
echo The GitHub Actions runner is now installed and running as a Windows service.
echo.
echo What happens now:
echo   1. When you push code to GitHub (main branch)
echo   2. GitHub Actions will automatically trigger
echo   3. The workflow will run on THIS computer
echo   4. It will deploy to your local Docker Desktop
echo   5. Your app will be accessible at:
echo      - Voting: http://localhost:5000
echo      - Results: http://localhost:5001
echo.
echo To check runner status:
echo   cd %RUNNER_DIR%
echo   svc.cmd status
echo.
echo To view runner logs:
echo   cd %RUNNER_DIR%\_diag
echo   notepad Runner_*.log
echo.
echo Next steps:
echo   1. Commit and push the workflow file to GitHub
echo   2. Watch it deploy automatically in GitHub Actions tab
echo.
pause