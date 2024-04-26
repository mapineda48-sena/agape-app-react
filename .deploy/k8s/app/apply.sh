# Cargar las variables del archivo .env y exportarlas
while IFS= read -r line || [[ -n "$line" ]]; do
    if [[ ! $line =~ ^\#.* ]] && [[ $line =~ .*=.* ]]; then
        export $line
    fi
done < <(cat ../.env; echo)

# kubectl logs agape-deployment-86c5f76756-xs78r --previous
# kubectl logs agape-deployment-fff9f6d-6hn44 -f
# kubectl describe pod agape-deployment-fff9f6d-6fwtg

# kubectl kustomize . | envsubst | kubectl delete -f - 
kubectl kustomize . | envsubst | kubectl delete -f - 