const expect = require('chai').expect
const code = require('../../components/about.js')

describe('about', () => {
    it("should return {'hello': 'world'}", () => {
        const actual = JSON.stringify(code.about())
        expect(actual).to.equal(JSON.stringify({'hello': 'world'}))
    })
})