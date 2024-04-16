Set-Location -Path $PSScriptRoot

function Replace-EnvironmentVariables {
    param(
        [Parameter(Mandatory = $true, ValueFromPipeline = $true)]
        [string]$content
    )
    
    process {
        # Encontrar todas las variables del tipo ${VARIABLE_NAME} en el contenido
        $variables = [regex]::Matches($content, '\$\{(\w+)\}') | ForEach-Object {
            $_.Groups[1].Value
        }
        
        # Reemplazar cada variable con su valor de entorno correspondiente
        foreach ($var in $variables) {
            $envValue = [Environment]::GetEnvironmentVariable($var)
            if ($envValue -ne $null) {
                $content = $content -replace "\$\{$var\}", $envValue
            } else {
                Write-Host "No se encontró un valor de entorno para la variable $var."
            }
        }
        
        # Devolver el contenido modificado
        return $content
    }
}

# Guardar el contenido en una variable de entorno
# $env:KUBECONFIG_CONTENTS = Get-Content "./config" -Raw

# Verificar si el archivo .env existe
$envFilePath = "./.env"
if (-Not (Test-Path $envFilePath)) {
    Write-Host "El archivo .env no existe."
    Exit
}

# Importar variables de entorno desde .env
$envFile = Get-Content $envFilePath
foreach ($line in $envFile) {
    # Ignorar comentarios y líneas vacías
    if (-not [string]::IsNullOrWhiteSpace($line) -and $line -notmatch "^\s*#") {
        # Capturar claves y valores
        if ($line -match "^\s*([^#]+?)\s*=\s*(.*)$") {
            # Trim extra spaces around key and value
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            Set-Item -Path env:$key -Value $value
        }
    }
}

# Kubectl config
# Configurar kubectl para que use el archivo kubeconfig
$KUBECONFIG = New-TemporaryFile

$env:KUBECONFIG_CONTENTS -replace '^(.+)$', '$1' | Set-Content -Path $KUBECONFIG.FullName

Set-Item -Path env:KUBECONFIG -Value $KUBECONFIG.FullName

# Ingress Ngnix
# https://kubernetes.github.io/ingress-nginx/deploy/#azure

Write-Host "Apply Ingress Ngnix"
kubectl apply -f "https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.7.0/deploy/static/provider/cloud/deploy.yaml"

# Cert Manager
# https://cert-manager.io/docs/installation/kubectl/
if ([string]::IsNullOrEmpty($env:CLUSTER_ISSUER_CERT) -eq $false) {
    kubectl apply -f "https://github.com/cert-manager/cert-manager/releases/download/v1.11.0/cert-manager.yaml"

    # https://cert-manager.io/docs/configuration/acme/
    $clusterIssuer = Get-Content "cert-manager/cluster-issuer.yml" -Raw | Replace-EnvironmentVariables

    while ($true) {
        $result = $clusterIssuer | kubectl apply -f -
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Aplicado el manifiesto cert manager..."
            break
        }

        Write-Host "Error al aplicar el manifiesto cert manager, reintentando en 6 segundos..."
        Start-Sleep -Seconds 6
    }
}
else {
    Write-Host "Error al aplicar Cert-manager"
}


# Comprobar que las variables de entorno necesarias están establecidas
if ([string]::IsNullOrWhiteSpace($env:GODADDY_API_KEY) -eq $false -and
    [string]::IsNullOrWhiteSpace($env:GODADDY_API_SECRET) -eq $false -and
    [string]::IsNullOrWhiteSpace($env:GODADDY_DOMAIN) -eq $false) {

    kubectl kustomize ./external-dns | Replace-EnvironmentVariables | kubectl apply -f - 

}else{
    Write-Host "Omitir external dns missing godady credentials"
}





# Pruebas
$CURRENTCONFIG = Get-Content $KUBECONFIG.FullName -Raw
Set-Content -Path "$env:USERPROFILE\.kube\config" -Value $CURRENTCONFIG