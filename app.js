const express = require('express');
const morgan = require('morgan');
const app = express();
const playstore = require('./playstore/playstore');

app.use(morgan('dev'));
app.get('/apps', (req, res) => {
  const {sort, genres} = req.query;
  let results= playstore;

  if(sort) {
    if (!['Rating', 'App'].includes(sort)) {
      return res.status(400).send('sort must contain "rating" or "app"');
    }
  }

  if (sort==='App') {
    results=
    results.sort((a, b) => {
      return a['App'] < b['App'] ? -1 : 1;
    });
  }

  if (sort==='Rating') {
    results=
    results.sort((a, b) => {
      return a['Rating'] > b['Rating'] ? -1 : 1;
    });
  }

  const validGenres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];
  if(genres){
    if (!validGenres.includes(genres)) {
      return res.status(400).send('genres must be either "Action", "Puzzle", "Strategy", "Casual", "Arcade", "Card"');
    }
    
  }

  if (genres) {
    results = 
    results.filter(app => app.Genres.includes(genres));
  }

  res.json(results);
});

module.exports = app;