const chai = require('chai')
const expect = chai.expect
const code = require('../../components/version.js')

describe('version', () => {
  it("should return {'version': 0.1}", () => {
    const actual = JSON.stringify(code.version())
    expect(actual).to.equal(JSON.stringify({ 'version': 0.1 }))
  })
})
