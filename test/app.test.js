const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

describe('Express App', () => {
  it('should return an array of apps', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
        const app = res.body[0];
        expect(app).to.include.keys(
          'Category', 'Rating', 'Reviews', 'Installs'
        );
      });
  });

  it('should return 400 if \'sort\' query is invalid', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'WRONG'})
      .expect(400, 'sort must contain "rating" or "app"');
  });

});