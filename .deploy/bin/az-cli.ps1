# Definir la URL del instalador de Azure CLI
$azCliUrl = "https://aka.ms/installazurecliwindows"

# Archivo temporal para el instalador
$tempInstaller = "$env:TEMP\azurecli.msi"

# Descargar el instalador de Azure CLI
try {
    Invoke-WebRequest -Uri $azCliUrl -OutFile $tempInstaller
} catch {
    Write-Error "Error descargando Azure CLI: $_"
    exit
}

# Instalar Azure CLI
try {
    Start-Process "msiexec.exe" -ArgumentList "/i $tempInstaller /quiet" -Wait
} catch {
    Write-Error "Error instalando Azure CLI: $_"
    exit
}

# Limpiar el instalador
Remove-Item -Path $tempInstaller

Write-Host "Azure CLI ha sido instalado correctamente."
