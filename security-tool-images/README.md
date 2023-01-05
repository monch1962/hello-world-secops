# Security tool images

This directory contains Dockerfiles to allow you to build images for the security scanning tools used in this repo

## Overview

In a production environment, you'd normally want to:
- build Docker images for each security tool
- store those Docker images in a private registry, where they can be version controlled by your organisation
- pull those images from your own private registry each time you want to run them

Instructions below describe how to build the Docker image, and run the built image within CI/CD. You should adapt these instructions to include storing the Docker image in your own private registry, then running it from that registry, rather than running directly from a Dockerfile stored on the Internet.

One possible way to do this is to create e.g. GCP Cloud Run jobs to build each Docker image from the instructions below on a regular basis, then push it to your registry, then check the built images for problems before starting to use them against your own codebase. Details of how to do this are beyond the scope of this article (for now...)

## Utilities

### jq

jq is pretty much the industry standard tool for processing JSON files. Where possible, the tools described below are configured to emit their results as JSON; this means you can use jq to examine the output from each tool, then automate how any problems are handled within the CI/CD pipeline.

#### Build Docker image

`$ docker pull stedolan/jq`


#### Run within CI/CD

Here's an example of how to use it

`$ cat package.json | docker run --rm -i stedolan/jq '.'`

## Software supply chain security

### cosign

cosign is a tool for signing, tagging and verifying Docker images. Generally speaking, within CI/CD you should:
- sign an image as soon as it has been created, using a public/private key pair that you control and which is secured appropriately
- as each CI check is run, tag the signed image as an attestation that the check has completed successfully. Where appropriate, you can use different sets of public/private key pairs that are controlled by the various teams responsible for the execution of each check
- as an image progresses through each step of CI & CD, the signed image can be checked to ensure that all previous CI checks have completed successfully before the next CI/CD step is executed. This allows you to enforce controls around sequencing CI checks, ensuring that only images that have successfully passed an appropriate set of checks are deployed to each non-prod and prod environment, and provides an audit trail of test coverage that can be referred to later

#### Build Docker image

`$ docker pull bitnami/cosign`

#### Run within CI/CD

`$ docker run --rm --name cosign bitnami/cosign:latest --help`

## Software Bill of Materials (SBOM)

### sbom-tool

#### Build Docker image

Note that you'll first need to install the DOTNET SDK from https://dotnet.microsoft.com/en-us/download/dotnet/6.0 in order to build this tool as a Docker image

`$ git clone https://github.com/microsoft/sbom-tool && cd sbom-tool/ && docker build -t sbom-tool . && cd .. && rm -rf sbom-tool`

#### Run within CI/CD

Refer to https://github.com/microsoft/sbom-tool/blob/main/docs/setting-up-ado-pipelines.md

## 3rd party vulnerability scan

### OSV-scanner

Very good summary of this tool is at https://anmalkov.com/blog/how-to-use-google-osv-scanner

OSV-scanner can be used to examine lockfiles created for many different languages, and search for vulnerabilies in packages described in those lockfiles. The list of supported lockfile formats is maintained at https://github.com/google/osv-scanner#input-a-lockfile

#### Build Docker image

OSV-scanner is built and maintained by Google at https://github.com/google/osv-scanner. For some reason there is no standard Docker image maintained by Google; however this one is built directly from Google's Dockerfile at https://github.com/google/osv-scanner/blob/main/Dockerfile every several days so is the next best thing...

`$ docker pull anmalkov/osv-scanner`

#### Run within CI/CD

To scan an SBOM file

`$ docker run -v /path/to/your/dir-with-sbom-file:/data anmalkov/osv-scanner --sbom=/data/sbom.json`

To scan lockfiles for many different languages

`$ docker run -v /path/to/your/dir-with-your-lock-files:/data anmalkov/osv-scanner --lockfile=/data/first-directory/package-lock.json --lockfile=/data/another-directory/Cargo.lock`

`$ docker run -v $(pwd):/data anmalkov/osv-scanner --json --lockfile=/data/package-lock.json > results/osv-scanner-results.json`

## Secrets scanning

### gitleaks

#### Build Docker image

`$ docker pull ghcr.io/zricethezav/gitleaks:latest`

#### Run within CI/CD

`$ docker run --rm -v $(pwd):/path zricethezav/gitleaks:latest detect --source="/path"`

## Policies

### opa

#### Build Docker image

`$ docker pull openpolicyagent/opa`

#### Run within CI/CD

To execute your tests against your OPA policies

`$ docker run --rm -v $(pwd)/policy:/policy openpolicyagent/opa test /policy --format json`

### conftest

#### Build Docker image

`$ docker pull openpolicyagent/conftest`

#### Run within CI/CD

`$ docker run --rm -v $(pwd)/policy:/policy -i openpolicyagent/conftest test -p /policy`

## 3rd party FOSS licence scan

### scancode-toolkit

#### Build Docker image

`$ git clone https://github.com/nexB/scancode-toolkit && cd scancode-toolkit && docker build --tag scancode-toolkit --tag scancode-toolkit:$(git describe --tags) . && cd .. && rm -rf scancode-toolkit`

#### Run within CI/CD

Note that running this tool will generally require at least several _hours_ for a non-trivial code base. Given that, it makes sense to run it in an 'out of band' CI process e.g. overnight or over a weekend, rather than for every build

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

#### Build Docker image

`$ docker pull koalaman/shellcheck`

#### Run within CI/CD

Assuming all shell scripts are named *.sh

`$ docker run --rm -v $(pwd):/mnt -i koalaman/shellcheck -f json1 -C *.sh`

### hadolint

#### Build Docker image

`$ docker pull hadolint/hadolint`

#### Run within CI/CD

Assuming you want to check a Dockerfile in the current directory

`$ docker run --rm -i hadolint/hadolint < Dockerfile`

## DAST

### ZAP

#### Build Docker image

`$ docker pull owasp/zap2docker-stable`

#### Run within CI/CD

As you're running ZAP inside a container, and using it to test an app running inside another container, you'll need to set up a Docker network and run both containers inside that network

`$ docker network create zapnet`

Build the app to be tested inside a container image

`$ docker build -t myapp .`

Start the app

`$ docker run --rm -i -p 8080:8080 --net zapnet myapp:latest &`

Create the directory structure to capture the results of the ZAP scan, and make it world-writable

`$ mkdir results && chmod 777 results`

We need to derive the IP address of the running app, which can be done using `$(ip -f inet -o addr show docker0 | awk '{print $4}' | cut -d '/' -f 1)`

Now run a 1-minute ZAP baseline test against the app. Note that by default a ZAP baseline test is designed to finish within 1 minute; this can be changed by changing the parameters of the baseline scan

`$ docker run --rm -v $(pwd)/results:/zap/wrk --net zapnet -t owasp/zap2docker-stable zap-baseline.py -t http://$(ip -f inet -o addr show docker0 | awk '{print $4}' | cut -d '/' -f 1):8080 -J zap-baseline-report.json`

Results of the scan should now be in JSON format under `./results/zap-baseline-report.json`. You can parse out those results using `cat results/zap-report.json | jq '.site[0].alerts'`

To extend the maximum time for running the ZAP baseline test to say 10 minutes, use the `-m` parameter

`$ docker run --rm -v $(pwd)/results:/zap/wrk --net zapnet -t owasp/zap2docker-stable zap-baseline.py -m 10 -t http://$(ip -f inet -o addr show docker0 | awk '{print $4}' | cut -d '/' -f 1):8080 -J zap-baseline-report.json`

To run a full ZAP scan,

`$ docker run --rm -v $(pwd)/results:/zap/wrk --net zapnet -t owasp/zap2docker-stable zap-full-scan.py -t http://$(ip -f inet -o addr show docker0 | awk '{print $4}' | cut -d '/' -f 1):8080 -J zap-full-scan-report.json`

---

#### Scanning a "real" application with ZAP

Now let's walk through the process of doing an active scan of a pseudo-real app, WebGoat

`$ docker pull webgoat/goatandwolf`

As you're running ZAP inside a container, and using it to test an app running inside another container, you'll need to set up a Docker network and run both containers inside that network

`$ docker network create zapnet`

Then start WebGoat running in a Docker container, in Docker's `zapnet` network. Note that we're exposing its ports at TCP/8081 and TCP/9091, as by default the ZAP Desktop uses TCP/8080 as a proxy

`$ docker run --rm --net zapnet --name goatandwolf -p 8081:8080 -p 9091:9090 -d webgoat/goatandwolf:latest`

Next step is to use the ZAP Desktop to perform a *manual* scan of the app. This should include:
- run an automated scan
- create a manual scan, including logging in as an authenticated user
- walking through as many links within the app as possible
- execute an active scan to capture the problems that exist today (note that this may not be strictly necessary, as ZAP's spider will detect links and scan them automatically)
- generate a report (you can select a template to produce either HTML or JSON output, depending on what you whether you want to review the results by eye or within CI/CD code)
- create a new automation plan within the ZAP laptop, covering what has been done in this session. Set the automation profile to "Full Scan", or something else as appropriate
- save the automation plan to a YAML file, and move it into the `./results` directory

Note that the above steps have already been done for the WebGoat app - the YAML file is `./results/zap.webgoat.yaml`. Note that the following parts of this file have been changed:
- the recorded URLs (http://localhost/... were changed to point to the address of WebGoat when running under Docker (http://172.17.0.1/...)
- the results directory was changed from what was recorded to `/zap/wrk`

For details that can be adapted to your own application, look at https://www.jit.io/blog/how-to-automate-owasp-zap

Now we've got a ZAP automation YAML created, we can fire up ZAP in a container and pass it the config file

`$ docker run --rm -t -v $(pwd)/results:/zap/wrk --net zapnet -t owasp/zap2docker-stable bash -c "zap.sh -cmd -addonupdate; zap.sh -cmd -autorun /zap/wrk/zap.webgoat.yaml"`