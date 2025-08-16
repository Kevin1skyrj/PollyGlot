@echo off
echo Starting PollyGlot Development Server...
echo.

REM Start backend server
echo Starting backend server on port 5000...
start cmd /k "cd server && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend development server
echo Starting frontend development server...
npm run dev

echo.
echo Both servers are now running:
echo - Frontend: http://localhost:5173
echo - Backend: http://localhost:5000
echo.
echo Press Ctrl+C to stop the development server
pause
