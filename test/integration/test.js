// const chai = require('chai')
const request = require('supertest')
// var expect = chai.expect
// let describe = chai.describe
// let it = chai.it
// const assert = chai.assert
// const describe = chai.describe
// const it = chai.it
// const chaiHttp = require('chai-http')
// chai.use(chaiHttp)

describe('trumpwall-integration', () => {
  it('/trumpwall should return "nothing to see here"', async () => {
    request('http://localhost:8080').get('/trumpwall')
      .expect(function (res) {
        res.to.have.status(200)
        res.body.to.have.text('nothing to see here')
      })
  })
})
