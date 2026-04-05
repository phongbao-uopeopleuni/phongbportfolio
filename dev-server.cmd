@echo off
setlocal EnableExtensions
cd /d "%~dp0"

where npm >nul 2>&1
if errorlevel 1 (
  echo [ERROR] npm not found. Install Node.js from https://nodejs.org and restart the terminal.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing dependencies first...
  call npm install
  if errorlevel 1 (
    echo npm install failed.
    pause
    exit /b 1
  )
)

echo.
echo Starting Vite dev server on port 3000...
echo Open: http://localhost:3000
echo.
call npm run dev
if errorlevel 1 (
  echo.
  echo Dev server exited with an error.
)
pause
