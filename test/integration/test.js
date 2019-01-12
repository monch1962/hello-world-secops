const chai = require('chai')
const request = require('supertest')
var expect = chai.expect
// let describe = chai.describe
// let it = chai.it
// const assert = chai.assert
// const describe = chai.describe
// const it = chai.it
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

describe('trumpwall-integration', () => {
  /* it('it should return "nothing to see here"', async () => {
    return chai.request('http://localhost:8080')
      .get('/trumpwall')
      .then(function (res) {
        expect(res).to.have.status(200)
        expect(res.text).to.equal('nothing to see here')
        // done()
      })
      .catch(function (err) {
        expect(err).to.be.null
      })
    // done()
  }) */

  it('it should return "nothing to see here"2', async () => {
    request('http://localhost:8080').get('/trumpwall')
      .expect(function (res) {
        res.to.have.status(200)
        res.body.to.have.text('nothing to see here')
      })
  })
})
