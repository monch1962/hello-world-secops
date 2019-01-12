const expect = require('chai').expect
const code = require('../../components/trumpwall.js')

describe('trumpwall', () => {
  it ("should return 'nothing'", () => {
    const actual = code.content()
    expect(actual).to.equal('nothing')
  })
})
