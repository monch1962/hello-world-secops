# Test cases

Test cases have been separated into unit, API and performance - this is a reasonable subset of what would normally be run in a CI pipeline

Unit tests sit under the `unit/` directory, and should be run via e.g. `npm test`. These tests don't require the application to be spun up, but will require all dependencies to have been previously deployed via e.g. `NODE_ENV=test npm install`

API tests sit under the `/api` directory, and should be run by wilee - after the app itself has been spun up. wilee will need to have been installed from Azure Artifacts to run these tests (so wilee will need to be loaded into Azure Artifacts first...)

Performance tests sit under the `/performance` directory, and should be run by Artillery - after the app itself has been spun up. Artillery will need to be deployed to run these tests

PACT tests (see https://docs.pact.io/) sit under the `/pacts` directory, and should be executed by whatever tool is used to deal with PACT tests

Stub definitions go under the `/stubs` directory. More details to come...