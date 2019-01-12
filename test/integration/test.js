const expect = require('chai').expect
const code = require('../../components/trumpwall.js')

describe('about', () => {
  it ("should return {'nothing'}", () => {
    const actual = JSON.stringify(code.about())
    expect(actual).to.equal('nothing')
  })
})
