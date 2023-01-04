# Security tool images

This directory contains Dockerfiles to allow you to build images for the security scanning tools used in this repo

## Overview

In a production environment, you'd normally want to:
- build Docker images for each security tool
- store those Docker images in a private registry, where they can be version controlled by your organisation
- pull those images from your own private registry each time you want to run them

Instructions below describe how to build the Docker image, and run the built image within CI/CD. You should adapt these instructions to include storing the Docker image in your own private registry, then running it from that registry, rather than running directly from a Dockerfile stored on the Internet.

One possible way to do this is to create e.g. GCP Cloud Run jobs to build each Docker image from the instructions below on a regular basis, then push it to your registry, then check the built images for problems before starting to use them against your own codebase. Details of how to do this are beyond the scope of this article (for now...)

---

## Utilities

### jq

jq is pretty much the industry standard tool for processing JSON files. Where possible, the tools described below are configured to emit their results as JSON; this means you can use jq to examine the output from each tool, then automate how any problems are handled within the CI/CD pipeline.

#### Build Docker image

`$ docker pull stedolan/jq`


#### Run within CI/CD

Here's an example of how to use it to pretty-print a `package.json` file. Use cases specific to other SecOps tools are documented below in the section for each tool

`$ cat package.json | docker run --rm -i stedolan/jq '.'`

### UUID

For testing, it's useful to be able to generate UUIDs on demand. While there's a ton of different ways to do this with bash, Python, Ruby, Powershell, this Docker image lets you create new UUIDs with minimal effort and no dependencies besides a working container runtime.

#### Build Docker image

`$ docker pull monch1962/uuid`

#### Run within CI/CD

To generate a UUID

`$ docker run monch1962/uuid`

---

## Software supply chain security

### cosign

cosign is a tool for signing, tagging and verifying Docker images. Generally speaking, within CI/CD you should:
- sign an image as soon as it has been created, using a public/private key pair that you control and which is secured appropriately
- as each CI check is run, tag the signed image as an attestation that the check has completed successfully. Where appropriate, you can use different sets of public/private key pairs that are controlled by the various teams responsible for the execution of each check
- as an image progresses through each step of CI & CD, the signed image can be checked to ensure that all previous CI checks have completed successfully before the next CI/CD step is executed. This allows you to enforce controls around sequencing CI checks, ensuring that only images that have successfully passed an appropriate set of checks are deployed to each non-prod and prod environment, and provides an audit trail of test coverage that can be referred to later

#### Build Docker image

`$ docker pull bitnami/cosign`

#### Generating a key pair

You'll want to generate a unique key pair for each role/person responsible for creating assertions for a built artifact. Each role should tag the artifact using their own private key; these signatures can then be checked using that role's public key. Using unique key pairs for each role allows you to implement separation of concerns in your SecOps processes, by ensuring that each signature & attestation can be traced back to a specific role/person.

To generate a key pair & store it locally under `./cosign-keys`

`$ COSIGN_PASSWORD=$(./uuid.sh)`

`$ mkdir cosign-keys`

`$ chmod 777 cosign-keys`

`$ docker run --rm -e COSIGN_PASSWORD=$COSIGN_PASSWORD -v $(pwd)/cosign-keys:/cosign-keys --name cosign bitnami/cosign:latest generate-key-pair`

#### Run within CI/CD

`$ docker run --rm --name cosign bitnami/cosign:latest --help`

---

## Software Bill of Materials (SBOM)

### sbom-tool

#### Build Docker image

Note that you'll first need to install the DOTNET SDK from https://dotnet.microsoft.com/en-us/download/dotnet/6.0 in order to build this tool as a Docker image

`$ git clone https://github.com/microsoft/sbom-tool && cd sbom-tool/ && docker build -t sbom-tool . && cd .. && rm -rf sbom-tool`

#### Run within CI/CD

Refer to https://github.com/microsoft/sbom-tool/blob/main/docs/setting-up-ado-pipelines.md

---

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

Assuming
- the code you want to scan is in the current directory
- the lockfile you want to scan is at `./package-lock.json`
- you want to save your OSV-scanner results to `./results/osv-scanner-results.json`

`$ docker run -v $(pwd):/data anmalkov/osv-scanner --json --lockfile=/data/package-lock.json > results/osv-scanner-results.json`

---

## Secrets scanning

### gitleaks

#### Build Docker image

`$ docker pull ghcr.io/zricethezav/gitleaks:latest`

#### Run within CI/CD

Assuming
- the code you want to scan is in the current directory
- you want the results of your gitleaks scan saved in JSON format to `./results/gitleaks-results.json`

`$ docker run --rm -v $(pwd):/path zricethezav/gitleaks:latest -f json detect --source="/path" > results/gitleaks-results.json`

---

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

---

## 3rd party FOSS licence scan

### scancode-toolkit

#### Build Docker image

`$ git clone https://github.com/nexB/scancode-toolkit && cd scancode-toolkit && docker build --tag scancode-toolkit --tag scancode-toolkit:$(git describe --tags) . && cd .. && rm -rf scancode-toolkit`

#### Run within CI/CD

Note that running this tool will generally require at least several _hours_ to scan a non-trivial code base. Given that, it makes sense to run it in an 'out of band' CI process e.g. overnight or over a weekend, rather than for every build

`$ docker run --rm -v $(pwd):/project scancode-toolkit:latest -n 10 --ignore "*.js,*.json,*.md,*.java,*.ts,*.go,*.exe,*.dll,*.jpg,*.gif,*.mp*,*.php,*.py,*.c,*.h,*.gz,*.zip,*.toml,*.yaml,*.cfg,*.yml,*.lib,*.xml,*.ini,*.tgz,*.pom" -clipeu --json-pp /project/results/scancode-toolkit-result.json .`

---

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

Assuming 
- you want to scan shell scripts in the current directory
- all shell scripts are named *.sh
- you want the results of the shellcheck scan to be saved at `./results/shellcheck-results.json`

`$ docker run --rm -v $(pwd):/mnt -i koalaman/shellcheck -f json1 -C *.sh | jq '.' > results/shellcheck-results.json`

Now if you want to highlight only results that are errors, you can use `jq`

`$ cat results/shellcheck-results.json |  jq '.comments[] | select(.level=="error")'`

### hadolint

#### Build Docker image

`$ docker pull hadolint/hadolint`

#### Run within CI/CD

Assuming
- you want to check a Dockerfile in the current directory, 
- your hadolint config file is at `./hadolint.yaml`, 
- you want the results of the hadolint scan to be saved at `./results/hadolint-results.json`

`$ docker run --rm -i -v $(pwd)/.hadolint.yaml:/.config/hadolint.yaml hadolint/hadolint < Dockerfile | jq '.' > results/hadolint-results.json`

Now if you want to highlight on results that are errors, you can use `jq`

`$ cat results/hadolint-results.json | jq '.[] | select(.level=="error")'`

---

## DAST

### ZAP

ZAP (Zed Attack Proxy) advertises itself as "The world's most widely used web attack scanner. Free and open source. Actively maintained by a dedicated international team of volunteers. A Github Top 1000 project"

It's a very powerful DAST, with a load of capabilities that are documented in detail at https://zaproxy.org. This document only covers straightforward scripted use cases for ZAP, but there is scope to build on these further if necessary.

#### Build Docker image

`$ docker pull owasp/zap2docker-stable`

#### Run within CI/CD

As you're running ZAP inside a container, and using it to test an app running inside another container, you'll need to set up a Docker network and run both containers inside that network

`$ docker network create zapnet`

Build the app to be tested inside a container image

`$ docker build -t myapp .`

Start the app

`$ docker run --rm -i -p 8080:8080 --net zapnet myapp:latest &`

Alternately you could start the WebGoat app, which has known problems that ZAP should be able to pick up

`$ docker run -p 8080:8080 -p 9090:9090 -e TZ=Australia/Sydney --net zapnet webgoat/webgoat &`

Create the directory structure to capture the results of the ZAP scan, and make it world-writable

`$ mkdir results && chmod 777 results`

We need to derive the IP address of the running app, which can be done using `$(ip -f inet -o addr show docker0 | awk '{print $4}' | cut -d '/' -f 1)`

Now run a ZAP baseline test against the app. 

`$ docker run --rm -v $(pwd)/results:/zap/wrk --net zapnet -t owasp/zap2docker-stable zap-baseline.py -t http://$(ip -f inet -o addr show docker0 | awk '{print $4}' | cut -d '/' -f 1):8080 -J zap-baseline-report.json`

Note that by default a ZAP baseline test is designed to finish within 1 minute, which is fast enough for CI/CD but may not be sufficient time. This can be changed by changing the `-m` parameter of the baseline scan. The following line will run a baseline ZAP scan for a maximum of 10 minutes

`$ docker run --rm -v $(pwd)/results:/zap/wrk --net zapnet -t owasp/zap2docker-stable zap-baseline.py -m 10 -t http://$(ip -f inet -o addr show docker0 | awk '{print $4}' | cut -d '/' -f 1):8080 -J zap-baseline-report.json`

Results of the scan should now be in JSON format under `./results/zap-baseline-report.json`. You can parse out those results using `cat results/zap-baseline-report.json | jq '.site[0].alerts'`

---

Alternately, a full ZAP scan can be run against the app as follows

`$ docker run --rm -v $(pwd)/results:/zap/wrk --net zapnet -t owasp/zap2docker-stable zap-full-scan.py -m 60 -t http://$(ip -f inet -o addr show docker0 | awk '{print $4}' | cut -d '/' -f 1):8080 -J zap-full-scan-report.json`

In this case, we're forcing the full scan to terminate after a maximum of 60 minutes. By default, a ZAP full scan isn't time-limited and will run for as long as it takes to complete - if that's what you want, you can remove `-m 60` from the above command line as follows

`$ docker run --rm -v $(pwd)/results:/zap/wrk --net zapnet -t owasp/zap2docker-stable zap-full-scan.py -t http://$(ip -f inet -o addr show docker0 | awk '{print $4}' | cut -d '/' -f 1):8080 -J zap-full-scan-report.json`

### htrace.sh

#### Build Docker image

`$ git clone https://github.com/trimstray/htrace.sh && cd htrace.sh && build/build.sh && cd .. && rm -rf htrace.sh`

#### Run within CI/CD

Assuming
- the app you want to test is running in the `zapnet` Docker network on your local host (see the ZAP section above for how to set this up)
- the app is accessible via TCP/8080

`$ docker run --rm --net zapnet -it --name htrace.sh htrace.sh -u http://$(ip -f inet -o addr show docker0 | awk '{print $4}' | cut -d '/' -f 1):8080 > results/htrace.sh-output.txt`

Note that this particular example will produce minimal output, as the sample app runs on http rather than https. If you want to hit a `https://nmap.org` as an example of a secured site to see what the output looks like, try this:

`$ docker run --rm -it --name htrace.sh htrace.sh -u https://nmap.org -s -h`
