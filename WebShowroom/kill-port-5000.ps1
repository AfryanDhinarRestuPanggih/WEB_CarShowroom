# Script untuk menghentikan proses yang menggunakan port 5000

Write-Host "=== Checking Port 5000 ===" -ForegroundColor Green

# Cari proses yang menggunakan port 5000
$process = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($process) {
    Write-Host "`nFound process using port 5000:" -ForegroundColor Yellow
    Get-Process -Id $process | Format-Table Id, ProcessName, CPU, StartTime -AutoSize
    
    Write-Host "`nStopping process..." -ForegroundColor Yellow
    Stop-Process -Id $process -Force
    Write-Host "Process stopped successfully!" -ForegroundColor Green
    
    Start-Sleep -Seconds 2
    Write-Host "`nPort 5000 is now free. You can run 'dotnet run' again." -ForegroundColor Cyan
}
else {
    Write-Host "`nNo process found using port 5000." -ForegroundColor Cyan
    Write-Host "Port 5000 is free!" -ForegroundColor Green
}

Write-Host "`n=== Done ===" -ForegroundColor Green
