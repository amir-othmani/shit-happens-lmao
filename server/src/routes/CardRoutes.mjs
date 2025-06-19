import express from 'express';
import { getRandomCard, getRandomCards, getCardBadLuckIndex } from '../dao/CardDao.mjs'; // Remove getCardById

const router = express.Router();
const INITIAL_CARDS = 3; // This constant represents the number of initial cards the player should have, for this application it is set to 3

// GET /api/cards/:id/bad-luck-index - Get only the bad luck index for a specific card
router.get('/:id/bad-luck-index', async (req, res) => {
  const cardId = parseInt(req.params.id);
  
  if (isNaN(cardId) || cardId <= 0) {
    return res.status(400).json({ error: 'Card ID must be a valid positive number' });
  }
  
  try {
    const badLuckIndex = await getCardBadLuckIndex(cardId);
    
    if (badLuckIndex === null) {
      return res.status(404).json({ error: 'Card not found' });
    }
    
    res.json({ badLuckIndex });
  }
  
  catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/cards/random/:count - This route should return 3 random cards with no duplicates
router.get('/random/:count', async (req, res) => {
  try {
    const count = parseInt(req.params.count);
    
    if (isNaN(count) || count !== INITIAL_CARDS) {
      return res.status(400).json({ error: `Incorrect amount of initial cards, the correct amount should be ${INITIAL_CARDS}`});
    }
    
    const cards = await getRandomCards(count);
    
    if (!cards || cards.length === 0) {
      return res.status(404).json({ error: 'No cards found' });
    }
    
    res.json(cards);
  } 
  
  catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/cards/random - This route should return a random card, excluding the ones already in play
                          // The random card is returned without the bad luck index
router.post('/random', async (req, res) => {
  try {
    // For design choices, the excludeIds parameter is required
    const { excludeIds } = req.body;
    
    if (!excludeIds) {
      return res.status(400).json({ error: 'excludeIds parameter is required' });
    }
    
    if (!Array.isArray(excludeIds)) {
      return res.status(400).json({ error: 'excludeIds parameter must be an array' });
    }
    
    if (excludeIds.length === 0) {
      return res.status(400).json({ error: 'excludeIds paremeter cannot be empty' });
    }
    
    // This validation checks if all the exlcuded IDs are nubmbers and if they are integers
    if (excludeIds.some(id => typeof id !== 'number' || !Number.isInteger(id))) {
      return res.status(400).json({ error: 'All card IDs must be integers' });
    }
    
    const card = await getRandomCard(excludeIds);
    
    if (!card) {
      return res.status(404).json({ error: 'No available cards found' });
    }
    
    res.json(card);
  }
  
  catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;