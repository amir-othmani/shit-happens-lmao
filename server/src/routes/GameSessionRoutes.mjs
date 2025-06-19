import express from 'express';
import { isLoggedIn } from '../middleware/auth.mjs';
import GameSessionService from '../services/GameSessionService.mjs';

const router = express.Router();
const INITIAL_CARDS = 3; // This constant represents the number of initial cards the player should have, for this application it is set to 3

// POST /api/game-session/start - Start a new game session
router.post('/start', isLoggedIn, async (req, res) => {
  try {
    const { initialCards } = req.body;
    const userId = req.user.id;

    // Validate initial cards
    if (!initialCards || !Array.isArray(initialCards) || initialCards.length !== INITIAL_CARDS) {
      return res.status(400).json({ error: `Initial cards must be an array of ${INITIAL_CARDS} cards` });
    }

    // Validate each card has required fields
    for (const card of initialCards) {
      if (!card.cardId || typeof card.cardId !== 'number') {
        return res.status(400).json({ error: 'Each card must have a valid cardId' });
      }
    }

    // Cancel any existing session for this user
    GameSessionService.cancelGame(userId);

    // Start new session
    const result = await GameSessionService.startGame(userId, initialCards);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to start game session' });
  }
});

// DELETE /api/game-session/cancel - Cancel current game session
router.delete('/cancel', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = GameSessionService.cancelGame(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel game session' });
  }
});

// GET /api/game-session/status - Get current game session status
router.get('/status', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id;
    const session = GameSessionService.getSession(userId);
    
    if (session) {
      res.json({
        hasActiveSession: true,
        currentRound: session.currentRound,
        roundsPlayed: session.rounds.length
      });
    } else {
      res.json({ hasActiveSession: false });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to get game session status' });
  }
});

export default router;