# Security tool images

This directory contains Dockerfiles to allow you to build images for the security scanning tools used in this repo

## Hadolint

`$ docker pull hadolint/hadolint`

`$ docker run --rm -i hadolint/hadolint < Dockerfile`

## Cosign

`$ docker pull bitnami/cosign`

## Shellcheck

`$ docker pull koalaman/shellcheck`

`$ docker run --rm -v $(pwd):/mnt -i koalaman/shellcheck *.sh`

## gitleaks

`$ docker pull ghcr.io/zricethezav/gitleaks:latest`

`$ docker run -v ${path_to_host_folder_to_scan}:/path zricethezav/gitleaks:latest [COMMAND] --source="/path" [OPTIONS]`

`$ docker run --rm -v $(pwd):/path zricethezav/gitleaks:latest detect --source="/path"`