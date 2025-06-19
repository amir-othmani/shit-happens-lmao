import db from '../db/stuff_db.mjs';
import GameHistory from '../models/GameHistory.mjs';

export const getAllGames = (userId) => {
  return new Promise((resolve, reject) => {
    // This quite complex query all the games of the requested player
    // and the cards played in each game, including the situation name for each card.
    // That's why there's a join between game_history and card_per_game and also another one
    // between card_per_game and card.
    // The first LEFT JOIN is used to include games that have no cards played.
    const sql = `
      SELECT gh.game_id, gh.date_game, gh.won_game,
             cpg.card, cpg.round, cpg.won_card,
             c.situation_name
      FROM game_history gh
      LEFT JOIN card_per_game cpg ON gh.game_id = cpg.game
      JOIN card c ON cpg.card = c.card_id
      WHERE gh.player = ?
      ORDER BY gh.game_id DESC, cpg.round
    `;

    db.all(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
      }
      
      else {
        // gamesMap will contain all of the games according to GameHistory model.
        // gamesMap is an object that uses game_id value as a key and, for each of them,
        // it stores a GameHistory object.
        // It is not used an array in case of games with non-consecutive IDs.
        /*
            Example of gamesMap structure:
            {
              '1': GameHistory { gameId: 1, dateGame: '2023-10-01', wonGame: true, cards: [...] },
              '2': GameHistory { gameId: 2, dateGame: '2023-10-02', wonGame: false, cards: [...] },
              ...
            }
        */
        const gamesMap = {};

        rows.forEach(row => {
          // Checks if there is already a game with a certain ID in gamesMap
          // If there is not, it creates a new GameHistory object
          if (!gamesMap[row.game_id]) {
            gamesMap[row.game_id] = new GameHistory(
              row.game_id,
              row.date_game,
              row.won_game,
              []    // Initialize cards as an empty array
            );
          }

          // Checks if the row contains all of the needed card information
          if (row.card !== undefined && row.round !== undefined && row.won_card !== undefined && row.situation_name !== undefined) {
            // Adds the card to the GameHistory object
            gamesMap[row.game_id].cards.push({
              card: row.card,
              situationName: row.situation_name,
              round: row.round,
              wonCard: row.won_card
            });
          }
        });
        resolve(Object.values(gamesMap));
      }
    });
  });
};

export const addGameToHistory = (player, dateGame, wonGame) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO game_history (player, date_game, won_game) VALUES (?, ?, ?)';
    // Convert boolean wonGame to integer (1 for true, 0 for false) for SQLite
    const wonGameValue = typeof wonGame === 'boolean' ? (wonGame ? 1 : 0) : wonGame;

    db.run(sql, [player, dateGame, wonGameValue], function(err) {
      if (err) {
        reject(err);
      }
      
      else {
        // this.lastID contains the ID of the last inserted row
        resolve({ gameId: this.lastID });
      }
    });
  });
};