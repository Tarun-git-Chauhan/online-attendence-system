param(
  [string]$DbName = "online_attendance",
  [string]$User = "postgres",
  [string]$Host = "localhost"
)
$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SqlFile = Join-Path $ScriptDir "online_attendance.sql"

Write-Host "==> Checking for database '$DbName'..." -ForegroundColor Cyan
$exists = & psql -U $User -h $Host -tAc "SELECT 1 FROM pg_database WHERE datname='$DbName'" 2>$null
if (-not $exists) {
  Write-Host "==> Creating database '$DbName'..." -ForegroundColor Cyan
  & createdb -U $User -h $Host $DbName
} else {
  Write-Host "==> Database exists." -ForegroundColor Green
}

Write-Host "==> Importing SQL..." -ForegroundColor Cyan
& psql -U $User -h $Host -d $DbName -f $SqlFile

Write-Host "==> Done. To verify: psql -U $User -h $Host -d $DbName -f verify.sql" -ForegroundColor Green
