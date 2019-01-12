const expect = require('chai').expect
const code = require('../../components/trumpwall.js')

describe('trumpwall', async () => {
  it("should return 'nothing to see here'", async () => {
    const actual = await code.content()
    expect(actual).to.equal('nothing to see here')
  })
})
