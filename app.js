import express from 'express';
import db from './db/db';

import { drawCards } from './utils';

// Set up the express app
const app = express();

/**
 * Middlewares
 */
app.use(function(req, res, next) {

  const MIN = 3;
  const MAX = 5;
  const num = +req.param('num');
  const NUM_OF_CARDS = num ? num : null;

  const greaterOrEqualThanMin = NUM_OF_CARDS >= MIN;
  const lessOrEqualThanMax = NUM_OF_CARDS <= MAX;

  if ( !( greaterOrEqualThanMin && lessOrEqualThanMax ) ) {
    const error = `Invalid request: You must request between 3 to 5 cards.`;
    res.status(400).json({
      error
    });
  }
  next();
});

app.use(function(req, res, next) {

  const num = +req.param('num');
  const isFalsyReq = db.length < num;

  if ( isFalsyReq ) {
    const error = `Invalid request: There are left ${ db.length } card(s) in the deck.`;
    res.status(400).json({
      error
    });
  }
  next();
});

/**
 * get cards by setting the num parameter
 * /api/v1/cards?num={NUMBER_OF_CARDS}
 */
app.get('/api/v1/cards', (req, res) => {

  const num = +req.param('num');
  const NUM_OF_CARDS = num ? num : null;
  const cards = drawCards(NUM_OF_CARDS, db);

  res.status(200).json({
    success: 'true',
    message: 'cards retrieved successfully',
    cards
  });
});

const PORT = 5000;

app.listen(process.env.PORT || PORT, () => {
  console.log(`server running on port ${PORT}`)
});
