'use strict'
const request = require('request-promise')
const TRUMPWALL_URL = 'http://www.trumpwall.com'

exports.content = async () => {
  const result = await request.get({ 'url': TRUMPWALL_URL, 'proxy': process.env.HTTP_PROXY })
  // console.log('result from http call: ' + result)
  return (result)
}
