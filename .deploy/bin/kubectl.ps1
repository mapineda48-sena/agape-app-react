# Definir la URL de descarga de kubectl
$kubectlUrl = "https://dl.k8s.io/release/v1.29.3/bin/windows/amd64/kubectl.exe"

# Carpeta donde se guardará kubectl
$destPath = "C:\Kubernetes"

# Crear el directorio si no existe
if (-Not (Test-Path $destPath)) {
    New-Item -ItemType Directory -Path $destPath
}

# Archivo para kubectl
$kubectlFile = "$destPath\kubectl.exe"

# Descargar kubectl
try {
    Invoke-WebRequest -Uri $kubectlUrl -OutFile $kubectlFile
} catch {
    Write-Error "Error descargando kubectl: $_"
    exit
}

# Añadir la carpeta al PATH del sistema si aún no está
$envPath = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::Machine)
if (-Not $envPath.Contains($destPath)) {
    $newPath = $envPath + ";" + $destPath
    [System.Environment]::SetEnvironmentVariable("Path", $newPath, [System.EnvironmentVariableTarget]::Machine)
}

Write-Host "kubectl ha sido instalado y añadido al PATH."
