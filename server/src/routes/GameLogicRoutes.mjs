import express from 'express';
import GameLogicService from '../services/GameLogicService.mjs';
import GameSessionService from '../services/GameSessionService.mjs';

const router = express.Router();

// POST /api/game-logic/place-card - Validate and place a card
router.post('/place-card', async (req, res) => {
  try {
    const { userId, cardId, position, isDemo, playerCards } = req.body;
    
    // For demo mode, we don't need authentication
    // For regular games, userId should be valid from session
    
    const result = await GameLogicService.validateAndPlaceCard(
      userId, 
      cardId, 
      position, 
      isDemo ? playerCards : null
    );
    
    // If game ended, save to database
    if (result.gameResult.gameEnded && !isDemo) {
      try {
        // Ends game session
        const completeGameData = GameSessionService.endGame(userId, result.gameResult.wonGame);
        // Saves game data to database
        await GameSessionService.saveCompleteGame(
          completeGameData.userId,
          completeGameData.dateGame,
          completeGameData.wonGame,
          completeGameData.cards
        );
        result.gameSaved = true;
      } catch (error) {
        result.gameSaved = false;
      }
    }

    res.json(result);
  }
  
  catch (error) {
    if (error.message === 'No active game session found') {
      res.status(404).json({ error: error.message });
    }
    else if (error.message === 'Card not found') {
      res.status(404).json({ error: error.message });
    }
    else {
      res.status(500).json({ error: 'Failed to place card' });
    }
  }
});

// POST /api/game-logic/timeout - Handle card timeout (PUBLIC)
router.post('/timeout', async (req, res) => {
  try {
    const { userId, cardId } = req.body;

    // Validate input
    if (!userId || typeof userId !== 'number') {
      return res.status(400).json({ error: 'userId is required and must be a number' });
    }

    if (!cardId || typeof cardId !== 'number') {
      return res.status(400).json({ error: 'cardId is required and must be a number' });
    }

    const result = await GameLogicService.handleTimeout(userId, cardId);
    
    // If game ended, save to database
    if (result.gameResult.gameEnded) {
      try {
        // Ends game session
        const completeGameData = GameSessionService.endGame(userId, result.gameResult.wonGame);
        // Saves game data to database
        await GameSessionService.saveCompleteGame(
          completeGameData.userId,
          completeGameData.dateGame,
          completeGameData.wonGame,
          completeGameData.cards
        );
        result.gameSaved = true;
      }
      
      catch (error) {
        result.gameSaved = false;
      }
    }

    res.json(result);
  }
  
  catch (error) {
    if (error.message === 'No active game session found') {
      res.status(404).json({ error: error.message });
    }
    else if (error.message === 'Card not found') {
      res.status(404).json({ error: error.message });
    }
    else {
      res.status(500).json({ error: 'Failed to handle timeout' });
    }
  }
});

export default router;