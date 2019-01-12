const chai = require('chai')
const expect = chai.expect
// const describe = chai.describe
// const it = chai.it
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

describe('trumpwall', () => {
  it('it should return "nothing to see here"', (done) => {
    chai.request('http://localhost:8080')
      .get('/trumpwall')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.text).to.equal('nothing to see here')
        done()
      })
  })
})
