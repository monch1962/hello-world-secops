const chai = require('chai')
const expect = chai.expect
// let describe = chai.describe
// let it = chai.it
const code = require('../../components/about.js')

describe('about-unit', () => {
  it("should return {'hello': 'world'}", () => {
    const actual = JSON.stringify(code.about())
    expect(actual).to.equal(JSON.stringify({ 'hello': 'world' }))
  })
})
