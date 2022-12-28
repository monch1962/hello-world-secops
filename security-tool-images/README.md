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

`$ docker run --rm -v $(pwd):/path zricethezav/gitleaks:latest detect --source="/path"`

## Policies

### opa

`$ docker pull openpolicyagent/opa`

`$ docker run --rm -v $(pwd)/policy:/policy openpolicyagent/opa test /policy --format json`

### conftest

`$ docker pull openpolicyagent/conftest`

`$ docker run --rm -v $(pwd)/policy:/policy -i openpolicyagent/conftest test -p /policy`

## 3rd party FOSS licence scan

### scancode-toolkit

`$ git clone https://github.com/nexB/scancode-toolkit && cd scancode-toolkit && docker build --tag scancode-toolkit --tag scancode-toolkit:$(git describe --tags) . && cd .. && rm -rf scancode-toolkit`

`$ docker run --rm -v $(pwd):/project scancode-toolkit:latest -n 10 --ignore "*.js,*.json,*.md,*.java,*.ts,*.go,*.exe,*.dll,*.jpg,*.gif,*.mp*,*.php,*.py,*.c,*.h,*.gz,*.zip,*.toml,*.yaml,*.cfg,*.yml,*.lib,*.xml,*.ini,*.tgz,*.pom" -clipeu --json-pp /project/results/scancode-toolkit-result.json .`

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

`$ docker run --rm -v $(pwd):/mnt -i koalaman/shellcheck -C *.sh`

### hadolint

`$ docker pull hadolint/hadolint`

`$ docker run --rm -i hadolint/hadolint < Dockerfile`

## DAST

### ZAP

`$ docker pull owasp/zap2docker-stable`

As you're running ZAP inside a container, and using it to test an app running inside another container, you'll need to set up a Docker network and run both containers inside that network

`$ docker network create zapnet`

Build the app to be tested inside a container image

`$ docker build -t myapp .`

Start the app

`$ docker run --rm -i -p 8080:8080 --net zapnet myapp:latest &`

Create the directory structure to capture the results of the ZAP scan, and make it world-writable

`$ mkdir results && chmod 777 results`

We need to derive the IP address of the running app, which can be done using `$(ip -f inet -o addr show docker0 | awk '{print $4}' | cut -d '/' -f 1)`

Now run a ZAP baseline test against the app

`$ docker run --rm -v $(pwd)/results:/zap/wrk --net zapnet -t owasp/zap2docker-stable zap-baseline.py -t http://$(ip -f inet -o addr show docker0 | awk '{print $4}' | cut -d '/' -f 1):8080 -J zap-report.json`

Results of the scan should now be in JSON format under `./results/zap-report.json`. You can parse out those results using `cat results/zap-report.json | jq '.site[0].alerts'`