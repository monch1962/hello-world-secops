const chai = require('chai')
const expect = chai.expect
// let describe = chai.describe
// let it = chai.it
const code = require('../../components/version.js')

describe('version-unit', () => {
  it("should return {'version': 0.1}", () => {
    const actual = JSON.stringify(code.version())
    expect(actual).to.equal(JSON.stringify({ 'version': 0.1 }))
  })
})
