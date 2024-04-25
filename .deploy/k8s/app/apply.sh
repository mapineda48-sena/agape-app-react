# Cargar las variables del archivo .env y exportarlas
while IFS= read -r line || [[ -n "$line" ]]; do
    if [[ ! $line =~ ^\#.* ]] && [[ $line =~ .*=.* ]]; then
        export $line
    fi
done < <(cat ../.env; echo)

export APP_NAME=agape
#export DEPLOY_IMAGE=

# kubectl logs agape-deployment-75d7fffd77-2wh52 --previous
# kubectl logs agape-deployment-75d7fffd77-2wh52 -f

kubectl kustomize . | envsubst | kubectl delete -f - 
kubectl kustomize . | envsubst | kubectl apply -f - 