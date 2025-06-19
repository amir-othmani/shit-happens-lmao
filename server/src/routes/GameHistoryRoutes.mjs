import express from 'express';
import { getAllGames } from '../dao/GameHistoryDao.mjs';
import GameSessionService from '../services/GameSessionService.mjs'; // Change this import
import dayjs from 'dayjs';
import { isLoggedIn } from '../middleware/auth.mjs';

const router = express.Router();

// GET /api/game-history - Get all game history for the requested user
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Validate userId
    if (userId === undefined || typeof userId !== 'number') {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const games = await getAllGames(userId);
    
    // Format dates using dayjs before sending to client
    const gamesWithFormattedDates = games.map(game => ({
      ...game,
      dateGame: dayjs(game.dateGame).format('YYYY-MM-DD HH:mm:ss')
    }));
    
    res.json(gamesWithFormattedDates);
  }
  
  catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/game-history - Add a new game history record with cards
router.post('/', isLoggedIn, async (req, res) => {
  const { userId, dateGame, wonGame, cards } = req.body;

  if (userId === undefined || dateGame === undefined || wonGame === undefined) {
    return res.status(400).json({ error: 'Missing required fields: userId, dateGame, wonGame' });
  }

  // Check if the requested user is correct
  if (userId !== req.user.id) {
    return res.status(403).json({ error: 'Cannot save game for another user' });
  }

  // Basic validation
  if (typeof userId !== 'number' || typeof dateGame !== 'number' || typeof wonGame !== 'boolean') {
    return res.status(400).json({ error: 'Invalid data types for userId, dateGame, or wonGame.' });
  }

  // Validate cards array if provided
  if (cards && !Array.isArray(cards)) {
    return res.status(400).json({ error: 'Cards must be an array' });
  }

  try {
    const result = await GameSessionService.saveCompleteGame(userId, dateGame, wonGame, cards);
    res.status(201).json(result);
  }
  
  catch (error) {
    res.status(500).json({ error: 'Internal server error while saving game' });
  }
});

export default router;