import db from '../db/stuff_db.mjs';
import Card from '../models/Card.mjs';

// This function retrieves the bad luck index for a specific card
export const getCardBadLuckIndex = (cardId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT bad_luck_index FROM card WHERE card_id = ?';
    
    db.get(sql, [cardId], (err, row) => {
      if (err) {
        reject(err);
      }
      else if (row === undefined) {
        resolve(null);
      }
      else {
        resolve(row.bad_luck_index);
      }
    });
  });
};

// This function retrieves the requested random card (excluding cards already in the user's hand)
export const getRandomCard = (excludeIds) => {
  return new Promise((resolve, reject) => {
    // excludeIds is required and must be a non-empty array
    if (!excludeIds || !Array.isArray(excludeIds) || excludeIds.length === 0) {
      reject(new Error('excludeIds is required and must be a non-empty array'));
      return;
    }
    
    // Conversion from excludeIds array of integers to a string of placeholders separated by commas for the SQL query
    const placeholders = excludeIds.map(() => '?').join(',');
    const sql = `SELECT card_id, situation_name, image FROM card WHERE card_id NOT IN (${placeholders}) ORDER BY RANDOM() LIMIT 1`;
    
    db.get(sql, excludeIds, (err, row) => {
      if (err) {
        reject(err);
      }
      else if (row === undefined) {
        resolve(null);
      }
      else {
        // Create card object without bad luck index (set to null)
        const card = {
          cardId: row.card_id,
          badLuckIndex: null,
          situationName: row.situation_name,
          image: row.image
        };
        resolve(card);
      }
    });
  });
};

// This function retrieves the requested random cards
export const getRandomCards = (count) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM card ORDER BY RANDOM() LIMIT ?';
    
    db.all(sql, [count], (err, rows) => {
      if (err) {
        reject(err);
      }
      else if (!rows || rows.length === 0) {
        resolve([]);
      }
      else {
        const cards = rows.map(row => 
          new Card(row.card_id, row.bad_luck_index, row.situation_name, row.image)
        );
        resolve(cards);
      }
    });
  });
};