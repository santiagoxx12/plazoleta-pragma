set -e

ng build --configuration production


BUCKET="plazoleta-pragma"

aws s3 sync dist/plazoleta-pragma/ s3://$BUCKET/ --delete --acl public-read

aws s3 ls s3://$BUCKET/ --recursive

