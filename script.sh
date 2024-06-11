#!/bin/bash

#Simple script to run docker image scan with Trivy
#*****Run script as root*****

image_list=$(docker ps | sed '1d' | awk '{ print $2}' | sort -u)
sleep 2

printf  "\n\n=======> Container Image List <=======\n"
echo "$image_list"

printf "\n\n=======> Cleaning Trivy Cache <=======\n"
trivy image --clear-cache &
wait

printf "\n\n=======> Scan in progress <=======\n"

#Generate unique output file (name)
timestamp=$(date +"%Y%m%d_%H%M%S")
touch image_scan_$timestamp.json

for x in $image_list
do
        #To generate a single file of complete scan
        trivy image --severity UNKNOWN,HIGH,CRITICAL --format json $x >> image_scan_$timestamp.json
        # trivy image --severity UNKNOWN,HIGH,CRITICAL $x >> image_scan_$timestamp.csv
done