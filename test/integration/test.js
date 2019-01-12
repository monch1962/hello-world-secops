const chai = require('chai')
let expect = chai.expect
// let describe = chai.describe
// let it = chai.it
// const assert = chai.assert
// const describe = chai.describe
// const it = chai.it
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

describe('trumpwall-integration', async () => {
  /* it('it should return "nothing to see here"', () => {
    return chai.request('http://localhost:8080')
      .get('/trumpwall')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.text).to.equal('nothing to see here')
        // done()
      })
    // done()
  }) */
  it('it should return "nothing to see here"', async () => {
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
  })
})
/*
chai.use(require('chai-as-promised'))

describe('trumpwall (promises)', async () => {
  it('it should return "nothing to see here"2', (done) => {
    chai.request('http://localhost:8080')
      .get('/trumpwall')
      .end((err, res) => {
        return expect(new Promise((resolve, reject) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.text).to.equal('nothing to see here')
        }))
      })
      .catch((error) => {
        assert.isNotOk(error, 'Promise error')
      })
  })

  it('it should return "nothing to see here"3', (done) => {
    return new Promise((resolve, reject) => {
      chai.request('http://localhost:8080')
        .get('/trumpwall')
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.text).to.equal('nothing to see here')
        })
    })
      .catch((error) => {
        assert.isNotOk(error, 'Promise error')
      })
  })
})
*/
