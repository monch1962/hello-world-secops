'use strict';
//const http = require('http')
const express = require('express')
var app = express()

const port = 8080

// Business logic sits under 'components' directory; need to unit test these
const about = require('components/about.js')
const version = require('components/version.js')

// http server routes to API test
app.get('/about', function (req, res) {
    res.send(about.about())
})

app.get('/version', function (req, res) {
    res.send(version.version())
})

app.listen(port, () => 
    console.log(`Example app listening on port ${port}!`))