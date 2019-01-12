const expect = require('chai').expect
const code = require('../../components/trumpwall.js')

describe('trumpwall', () => {
  it("should return 'nothing to see here'", () => {
    const actual = code.content()
    expect(actual).to.equal('nothing to see here')
  })
})
