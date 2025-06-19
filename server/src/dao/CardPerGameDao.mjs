import db from '../db/stuff_db.mjs';

// Add a single card to game record
export const addCardToGame = (gameId, cardId, round, wonCard) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO card_per_game (game, card, round, won_card) VALUES (?, ?, ?, ?)';
    // If wonCard is null, it means that it was an initial card,
    // so it should be kept null in the database.
    const wonCardValue = wonCard === null ? null : (wonCard ? 1 : 0);

    db.run(sql, [gameId, cardId, round, wonCardValue], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ pairId: this.lastID });
      }
    });
  });
};