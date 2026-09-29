@echo off
setlocal
cd /d "%~dp0"

echo ==========================================
echo        OpsCell - Windows Build
echo ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js is not installed.
  echo Install the LTS version from https://nodejs.org/
  pause
  exit /b 1
)

echo Node.js:
node -v
echo npm:
npm -v
echo.

if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo.
    echo ERROR: npm install failed.
    pause
    exit /b 1
  )
)

echo.
echo Building Windows installer...
call npm run build
if errorlevel 1 (
  echo.
  echo ERROR: Build failed.
  pause
  exit /b 1
)

echo.
echo ==========================================
echo Done.
echo Installer is in the dist folder.
echo ==========================================
pause
