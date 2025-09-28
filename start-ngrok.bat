@echo off
echo Starting ngrok tunnel for MIMAA Web Application...

REM Démarrer ngrok pour le frontend (port 5173) avec proxy vers backend
start "ngrok-frontend" cmd /k "ngrok http 5173"

echo.
echo Ngrok tunnel is starting...
echo Frontend: http://localhost:5173
echo Backend: http://localhost:3001 (via proxy)
echo.
echo The frontend will proxy API requests to the local backend
echo Check the ngrok window for the public URL
echo.
pause
