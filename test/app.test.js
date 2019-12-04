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

  const validSortValues = ['Rating', 'App'];
  validSortValues.forEach(sortValue => {
    it(`should return an array of apps sorted by ${sortValue}`, () => {
      return supertest(app)
        .get('/apps')
        .query({ sort: sortValue })
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('array');
          let i = 0, sorted = true;
          while (sorted && i < res.body.length -1) {
            sorted = sorted && res.body[i][sortValue] <= res.body[i + 1][sortValue];
            i++;
          }
          expect(sorted).to.be.true;
        });
    });
  });

  it('should return 400 if \'genres\' query is invalid', () => {
    return supertest(app)
      .get('/apps')
      .query({ genres: 'WRONG'})
      .expect(400, 'genres must be either "Action", "Puzzle", "Strategy", "Casual", "Arcade", "Card"');
  });

  const validGenres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];
  validGenres.forEach(genre => {
    it(`should return an array of apps filtered by ${genre}`, () => {
      return supertest(app)
        .get('/apps')
        .query({genres: genre})
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('array');
          const app= res.body[0];
          expect(app.Genres).to.equal(genre);
          
        });
    });
  });
  
});