# Security tool images

This directory contains Dockerfiles to allow you to build images for the security scanning tools used in this repo

## Overview

In a production environment, you'd normally want to:
- build Docker images for each security tool
- store those Docker images in a private registry, where they can be version controlled by your organisation
- pull those images from your own private registry each time you want to run them

## Software supply chain security

### cosign

`$ docker pull bitnami/cosign`

## Secrets scanning

### gitleaks

`$ docker pull ghcr.io/zricethezav/gitleaks:latest`

`$ docker run -v ${path_to_host_folder_to_scan}:/path zricethezav/gitleaks:latest [COMMAND] --source="/path" [OPTIONS]`

`$ docker run --rm -v $(pwd):/path zricethezav/gitleaks:latest detect --source="/path"`

## Policies

### opa

`$ docker pull openpolicyagent/opa`

### conftest

`$ docker pull openpolicyagent/conftest`

`$ docker run --rm -v $(pwd)/policy:/policy -i openpolicyagent/conftest test -p /policy`

## SAST 

### sonarcloud

`$ docker pull sonarsource/sonarcloud-scan`

`$ docker pull sonarsource/sonar-scanner-cli`

`$ docker run \\
    --rm \\
    -e SONAR_HOST_URL="<http://$>{SONARQUBE_URL}" \\
    -e SONAR_LOGIN="myAuthenticationToken" \\
    -v "${YOUR_REPO}:/usr/src" \\
    sonarsource/sonar-scanner-cli`

### Shellcheck

`$ docker pull koalaman/shellcheck`

`$ docker run --rm -v $(pwd):/mnt -i koalaman/shellcheck *.sh`

### hadolint

`$ docker pull hadolint/hadolint`

`$ docker run --rm -i hadolint/hadolint < Dockerfile`

## DAST

### ZAP

`$ docker pull owasp/zap2docker-stable`

As you're running ZAP inside a container, and using it to test an app running inside another container, you'll need to use a Docker network

`$ docker network create zapnet`

Build the app to be tested inside a container image

`$ docker build -t myapp -f .`

Start the app

`$ docker run --rm -i --net zapnet myapp`

Now run a ZAP baseline test against the app

`$ docker run -v $(pwd):/results --net zapnet -t owasp/zap2docker-stable zap-baseline.py -t https://myapp -j /results/zap-results.json`