Write-Host "Starting ngrok tunnel for MIMAA Web Application..." -ForegroundColor Green

# Démarrer ngrok pour le frontend (port 5173) avec proxy vers backend
Start-Process -FilePath "ngrok" -ArgumentList "http", "5173" -WindowStyle Normal

Write-Host ""
Write-Host "Ngrok tunnel is starting..." -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:3001 (via proxy)" -ForegroundColor Cyan
Write-Host ""
Write-Host "The frontend will proxy API requests to the local backend" -ForegroundColor Magenta
Write-Host "Check the ngrok window for the public URL" -ForegroundColor Magenta
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
