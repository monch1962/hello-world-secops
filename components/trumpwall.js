'use strict'
const request = require('request')

// Trivial integration function to integration test
exports.content = () => {
  request('http://www.trumpwall.com', function (err, res, body) {
    return (body)
  })
}
