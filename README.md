# AI-starter

To get this project running with docker:

```
docker-compose up
```

Then run database migrations:
```
./migrate.sh
```

The web app will then be accessible at http://localhost:8080/.

## Deploying with Cloudformation

The cloudformation template file `cloudformation.json` is published here: https://1280labs-boosterpack.s3.ca-central-1.amazonaws.com/ai-starter/cloudformation.json

As such this project is deployable by visiting the following link: https://console.aws.amazon.com/cloudformation/home#/stacks/create/review?templateURL=https://1280labs-boosterpack.s3.ca-central-1.amazonaws.com/ai-starter/cloudformation.json&stackName=ai-starter

### Troubleshooting

To debug the deployment first navigate to the EC2 instance in the AWS dashboard and connect with "EC2 Instance Connect". To view logs from the deployment use:
```
tail -f /var/log/cloud-init-output.log
```
