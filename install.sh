#!/bin/bash

#####################################################################
#
# This script installs the 1280 Labs AI-starter application
#
#####################################################################

yum -y update

yum -y install docker git

curl -L https://github.com/docker/compose/releases/download/1.22.0/docker-compose-$(uname -s)-$(uname -m) -o /usr/bin/docker-compose

chmod +x /usr/bin/docker-compose

rm -r -f ~/ai-starter
git clone https://github.com/anthonyfierrosoftware/ai-starter ~/ai-starter
cd ~/ai-starter

echo "Enable Docker Service"
systemctl enable docker.service

echo "Starting Docker Service"
systemctl start docker.service

echo "Launching Docker Project"
docker compose up -d --wait

echo "Running database migrations"
./migrate.sh
