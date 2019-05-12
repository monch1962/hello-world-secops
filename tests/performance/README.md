# Artillery test

This test runs a 60 second test, of 20 concurrent users, against the `/about` and `/version` endpoints.

It is deemed to have passed if the 95%ile response time is <10ms, and the error rate is <1%
