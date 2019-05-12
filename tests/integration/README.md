The app relies on an external dependency at http://www.trumpwall.com (no, it doesn't exist at the time of writing this).

The app exposes an API `GET /trumpwall`, and this API returns the body of http://trumpwall.com. This site doesn't exist at the time of writing this, but it is required as an external dependency of this site.

For integration testing, we're going to run the Hoverfly stub engine (https://github.com/SpectoLabs/hoverfly) then stub out the `http://trumpwall.com` dependency using the file trumpwall.com.stub.json.

Once that stub is running, a `GET /trumpwall` call to this app should return some content that can be tested.

After the stub is running, test.js will run an integration test against the stubbed `GET /trumpwall` endpoint

Any test cases in this directory should be automatically executed by CI