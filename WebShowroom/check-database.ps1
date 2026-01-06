# Script untuk cek status database

Write-Host "=== Checking Database Status ===" -ForegroundColor Green

# Check Cars
Write-Host "`nChecking Cars in Database..." -ForegroundColor Yellow
try {
    $carsResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/Cars" -Method GET
    Write-Host "Total Cars Available: $($carsResponse.Count)" -ForegroundColor Cyan
    
    if ($carsResponse.Count -gt 0) {
        Write-Host "`nCars List:" -ForegroundColor Yellow
        foreach ($car in $carsResponse) {
            Write-Host "  - $($car.brand) $($car.model) ($($car.year)) - Stock: $($car.stock) - Status: $($car.status)" -ForegroundColor White
        }
    }
    else {
        Write-Host "No cars found!" -ForegroundColor Red
    }
}
catch {
    Write-Host "Error checking cars: $_" -ForegroundColor Red
}

Write-Host "`n=== Check Complete ===" -ForegroundColor Green
