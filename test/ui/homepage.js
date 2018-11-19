const expect = require('chai').expect
const code = require('../../html/homepage.js')

describe('homepage', () => {
    it("should return HTML hello world!", () => {
        const actual = (code.content())
        expect(actual).to.equal('<html>hello world!</html>')
    })
})