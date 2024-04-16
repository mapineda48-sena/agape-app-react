# Definir la URL de descarga de Terraform
$terraformUrl = "https://releases.hashicorp.com/terraform/1.8.0/terraform_1.8.0_windows_amd64.zip"

# Carpeta donde se extraerá Terraform
$destPath = "C:\Terraform"

# Crear el directorio si no existe
if (-Not (Test-Path $destPath)) {
    New-Item -ItemType Directory -Path $destPath
}

# Archivo temporal para el zip descargado
$tempZip = "$env:TEMP\terraform.zip"

# Descargar Terraform
try {
    Invoke-WebRequest -Uri $terraformUrl -OutFile $tempZip
} catch {
    Write-Error "Error descargando Terraform: $_"
    exit
}

# Extraer el archivo
try {
    Expand-Archive -Path $tempZip -DestinationPath $destPath
} catch {
    Write-Error "Error al extraer Terraform: $_"
    exit
}

# Limpiar el archivo zip descargado
Remove-Item -Path $tempZip

# Añadir la carpeta al PATH del sistema si aún no está
$envPath = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::Machine)
if (-Not $envPath.Contains($destPath)) {
    $newPath = $envPath + ";" + $destPath
    [System.Environment]::SetEnvironmentVariable("Path", $newPath, [System.EnvironmentVariableTarget]::Machine)
}

Write-Host "Terraform ha sido instalado y añadido al PATH."
