# Security tool images

This directory contains Dockerfiles to allow you to build images for the security scanning tools used in this repo

## Overview

In a production environment, you'd normally want to:
- build Docker images for each security tool
- store those Docker images in a private registry, where they can be version controlled by your organisation
- pull those images from your own private registry each time you want to run them

## Utilities

### jq

`$ docker pull stedolan/jq`

Here's an example of how to use it

`$ cat package.json | docker run --rm -i stedolan/jq '.'`

## Software supply chain security

### cosign

`$ docker pull bitnami/cosign`

`$ docker run --rm --name cosign bitnami/cosign:latest --help`

## Software Bill of Materials (SBOM)

### sbom-tool

#### Build Docker image

Note that you'll first need to install the DOTNET SDK from https://dotnet.microsoft.com/en-us/download/dotnet/6.0 in order to build this tool as a Docker image

`$ git clone https://github.com/microsoft/sbom-tool && cd sbom-tool/ && docker build -t sbom-tool . && cd .. && rm -rf sbom-tool`

#### Run

Refer to https://github.com/microsoft/sbom-tool/blob/main/docs/setting-up-ado-pipelines.md

## 3rd party vulnerability scan

### OSV-scanner

Very good summary of this tool is at https://anmalkov.com/blog/how-to-use-google-osv-scanner

OSV-scanner can be used to examine lockfiles created for many different languages. The list of supported lockfile formats is maintained at https://github.com/google/osv-scanner#input-a-lockfile

OSV-scanner is built and maintained by Google at https://github.com/google/osv-scanner. For some reason there is no standard Docker image maintained by Google; however this one is built directly from Google's Dockerfile at https://github.com/google/osv-scanner/blob/main/Dockerfile every several days so is the next best thing...

`$ docker pull anmalkov/osv-scanner`

To scan an SBOM file

`$ docker run -v /path/to/your/dir-with-sbom-file:/data anmalkov/osv-scanner --sbom=/data/sbom.json`

To scan lockfiles for many different languages

`$ docker run -v /path/to/your/dir-with-your-lock-files:/data anmalkov/osv-scanner --lockfile=/data/first-directory/package-lock.json --lockfile=/data/another-directory/Cargo.lock`

`$ docker run -v $(pwd):/data anmalkov/osv-scanner --json --lockfile=/data/package-lock.json > results/osv-scanner-results.json`

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

`$ docker run --rm -v $(pwd):/mnt -i koalaman/shellcheck -f json1 -C *.sh`

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