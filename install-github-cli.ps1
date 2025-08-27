# Script para instalar GitHub CLI manualmente
# Ejecutar: .\install-github-cli.ps1

Write-Host "Instalando GitHub CLI..." -ForegroundColor Green

# Crear directorio temporal
$tempDir = "$env:TEMP\gh-install"
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

# Descargar GitHub CLI
$ghVersion = "2.40.1"
$downloadUrl = "https://github.com/cli/cli/releases/download/v$ghVersion/gh_$ghVersion`_windows_amd64.zip"
$zipPath = "$tempDir\gh.zip"

Write-Host "Descargando GitHub CLI v$ghVersion..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath

# Extraer archivo
Write-Host "Extrayendo archivos..." -ForegroundColor Yellow
Expand-Archive -Path $zipPath -DestinationPath $tempDir -Force

# Mover a directorio de programas
$installDir = "$env:ProgramFiles\GitHub CLI"
New-Item -ItemType Directory -Force -Path $installDir | Out-Null
Copy-Item "$tempDir\gh_$ghVersion`_windows_amd64\bin\gh.exe" -Destination "$installDir\gh.exe" -Force

# Agregar al PATH
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
if ($currentPath -notlike "*$installDir*") {
    [Environment]::SetEnvironmentVariable("PATH", "$currentPath;$installDir", "Machine")
    $env:PATH += ";$installDir"
}

# Limpiar archivos temporales
Remove-Item $tempDir -Recurse -Force

Write-Host "GitHub CLI instalado en: $installDir" -ForegroundColor Green
Write-Host "Reinicia PowerShell para que los cambios surtan efecto" -ForegroundColor Yellow

