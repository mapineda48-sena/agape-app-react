$env:APP_NAME = "database"
$env:DOMAIN = "mapineda48.de"
$env:DEPLOY_IMAGE = "dpage/pgadmin4:7.4"

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

kubectl kustomize . | Replace-EnvironmentVariables | kubectl apply -f - 