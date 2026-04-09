Write-Host "Checking for existing processes on port 8080..." -ForegroundColor Cyan

$process = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($process) {
    # Get-NetTCPConnection might return multiple identical connections for IPv4/IPv6
    $uniqueIds = $process.OwningProcess | Select-Object -Unique
    foreach ($id in $uniqueIds) {
        Write-Host "Port 8080 is in use. Killing process ID $id..." -ForegroundColor Yellow
        Stop-Process -Id $id -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
    Write-Host "Process killed successfully." -ForegroundColor Green
} else {
    Write-Host "Port 8080 is completely free." -ForegroundColor Green
}

Write-Host "Starting Spring Boot Application..." -ForegroundColor Cyan
mvn clean spring-boot:run -U