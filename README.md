# hello-world-devops
Trivial app to explore workflow &amp; CI pipelining in different CI frameworks
[![Build Status](https://dev.azure.com/monch1962/monch1962/_apis/build/status/monch1962.hello-world-devops)](https://dev.azure.com/monch1962/monch1962/_build/latest?definitionId=1)
## Intention
This is a trivial NodeJS app, with a few unit tests, a few integration tests, a few PACTs and a few performance tests. Intended use case is to discover and document how to build/test/deploy this app within different CI frameworks

## Starting the app
To start the app running in a CI-ready state
`$ NODE_ENV=test npm install && node helloworld.js`

## Running unit tests
Ensure all the app dependencies have been installed (`NODE_ENV=test npm install`), then run `npm run test`

## Running UI tests

Details to follow

## Running API tests

Details to follow

## Running performance tests

Details to follow
