# Script untuk seed database dengan admin dan mobil

Write-Host "=== Seeding Database ===" -ForegroundColor Green

# Seed Admin
Write-Host "`nSeeding Admin Account..." -ForegroundColor Yellow
try {
    $adminResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/Seed/admin" -Method POST -ContentType "application/json"
    Write-Host "Admin Result: $($adminResponse.message)" -ForegroundColor Cyan
    if ($adminResponse.email) {
        Write-Host "Email: $($adminResponse.email)" -ForegroundColor Cyan
        Write-Host "Password: $($adminResponse.password)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Error seeding admin: $_" -ForegroundColor Red
}

# Seed Cars
Write-Host "`nSeeding Sample Cars..." -ForegroundColor Yellow
try {
    $carsResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/Seed/cars" -Method POST -ContentType "application/json"
    Write-Host "Cars Result: $($carsResponse.message)" -ForegroundColor Cyan
    Write-Host "Total Cars: $($carsResponse.count)" -ForegroundColor Cyan
} catch {
    Write-Host "Error seeding cars: $_" -ForegroundColor Red
}

Write-Host "`n=== Seeding Complete ===" -ForegroundColor Green
Write-Host "`nSekarang refresh halaman Buy Cars di browser!" -ForegroundColor Yellow
