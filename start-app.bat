@echo off
echo ========================================
echo   DEMARRAGE DE L'APPLICATION MIMA'A
echo ========================================
echo.

echo 1. Arrêt des processus Node.js existants...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo 2. Démarrage du serveur JSON...
start /b node simple-server.cjs
timeout /t 3 /nobreak >nul

echo 3. Démarrage de l'application React...
echo    L'application va s'ouvrir dans votre navigateur.
echo.
start npm run dev

echo.
echo ✅ Application MIMA'A démarrée !
echo    - Serveur JSON: http://localhost:3001
echo    - Application: http://localhost:5173
echo.
pause
