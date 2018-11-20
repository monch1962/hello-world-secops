# hello-world-devops
Trivial app to explore workflow &amp; CI pipelining in different CI frameworks

[![Build Status](https://dev.azure.com/monch1962/monch1962/_apis/build/status/monch1962.hello-world-devops)](https://dev.azure.com/monch1962/monch1962/_build/latest?definitionId=1)
## Intention
This is a trivial NodeJS app, with a few unit tests, a few integration tests, a few PACTs and a few performance tests. Intended use case is to discover and document how to build/test/deploy this app within different CI frameworks

## Manual app startup & test execution

### Starting the app
To start the app running in a CI-ready state

`$ NODE_ENV=test npm install && node helloworld.js`

### Running unit tests
Ensure all the app dependencies have been installed (`NODE_ENV=test npm install`), then 

`$ npm run unittests`

### Running UI tests

Ensure all the app dependencies have been installed (`NODE_ENV=test npm install`), then 

`$ npm run uitests`

### Running API tests

Ensure all the app dependencies have been installed (`NODE_ENV=test npm install`), then

`$ node helloworld.js &`

to start the application.

Get a copy of wilee (https://github.com/monch1962/wilee) and build it locally using `$ make local`

Execute tests using

`$ APP=http://localhost:8080 TESTCASES=test/api/*.wilee.json ./wilee`

and analyse results

### Running performance tests

Ensure all the app dependencies have been installed (`NODE_ENV=test npm install`), then

`$ node helloworld.js &`

`$ npm install -g artillery`

`$ artillery run test/performance/performance.yml`

## Automated CI pipeline execution
The app is hooked into its own Azure DevOps pipeline, and will run through all build/test steps automatically whenever a pull request is made to this repo. Note the build status 'badge' earlier in this README file - it indicates whether the build/test steps passed last time the pipeline was executed.

Pipeline build & test config for this test is held in the file `azure-pipelines.yml`
