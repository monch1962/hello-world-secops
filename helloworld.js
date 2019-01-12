'use strict'
const express = require('express')
var app = express()

const port = 8080

// Business logic sits under 'components' directory; need to unit test these
const about = require('./components/about.js')
const version = require('./components/version.js')
const homepage = require('./html/homepage.js')
const trumpwall = require('./components/trumpwall.js')

// http server routes to API test
app.get('/about', function (req, res) {
  res.send(about.about())
})

app.get('/version', function (req, res) {
  res.send(version.version())
})

app.get('/', function (req, res) {
  res.send(homepage.content())
})

app.get('/trumpwall', async function (req, res, next) {
  const response = await trumpwall.content()
  // console.log('response from /trumpwall call: ' + response)
  res.send(response)
})

app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`))
