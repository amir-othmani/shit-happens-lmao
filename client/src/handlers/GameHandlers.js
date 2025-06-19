import { getRandomCard, placeCard, handleCardTimeout, getCardBadLuckIndex } from '../API/API.js';

/**
 * Handle card placement for both demo and authenticated game
 * To be used by createPlaceCardHandler (the next function)
 */
async function handleCardPlacement({
  position,
  gameEnded,
  newCard,
  sortedPlayerCards,
  setPlayerCards,
  setModalMsg,
  setShowModal,
  setGameEnded,
  isDemo = false,
  setNewCard,
  loggedInUser
}) {
  // Don't process if game is over or no card to place
  if (gameEnded || !newCard) return;
  
  if (isDemo) {
    // Demo logic - server validates placement and returns immediate game end
    try {
      // Call server API with demo flag and current player cards for validation
      const result = await placeCard(0, newCard.cardId, position, { 
        isDemo: true, 
        playerCards: sortedPlayerCards 
      });
      
      // Show result message and end the demo game
      setModalMsg(result.gameResult.message);
      setShowModal(true);
      setGameEnded(true); // Demo games always end after one placement
      
      // If placement was correct, add the card to the player's hand
      if (result.isValidPlacement) {
        const cardWithBadLuck = { ...newCard, badLuckIndex: result.badLuckIndex };
        const updatedPlayerCards = [...sortedPlayerCards];
        updatedPlayerCards.splice(position, 0, cardWithBadLuck); // Insert at specified position
        setPlayerCards(updatedPlayerCards);
      }
      
    } catch (error) {
      setModalMsg('Error occurred while processing your guess');
      setShowModal(true);
    }
    return;
  }
  
  // Regular game logic - send to server
  try {
    const result = await placeCard(loggedInUser.id, newCard.cardId, position);
    
    // Update the newCard with the bad luck index revealed by server
    if (setNewCard && result.badLuckIndex) {
      setNewCard({ ...newCard, badLuckIndex: result.badLuckIndex });
    }
    
    // Display the result message to the player
    setModalMsg(result.gameResult.message);
    setShowModal(true);
    
    // Check if this placement ended the game (win or lose condition met)
    if (result.gameResult.gameEnded) {
      setGameEnded(true);
    }
    
    // If placement was correct, add the card to player's collection
    if (result.isValidPlacement) {
      const cardWithBadLuck = { ...newCard, badLuckIndex: result.badLuckIndex };
      setPlayerCards(prev => {
        const updated = [...prev, cardWithBadLuck];
        // Re-sort cards by bad luck index to maintain correct order
        return updated.sort((a, b) => a.badLuckIndex - b.badLuckIndex);
      });
    }
    
  } catch (error) {
    setModalMsg('Error occurred while processing your guess');
    setShowModal(true);
  }
}

/**
 * Handles placing a card at a specific position in the player's hand
 */
export const createPlaceCardHandler = ({
  playerCards,
  gameEnded,
  newCard,
  setPlayerCards,
  setModalMsg,
  setShowModal,
  setGameEnded,
  demoMode,
  setNewCard,
  loggedInUser
}) => {
  return async (position) => {
    // Sort player cards by bad luck index for consistent positioning
    const sortedPlayerCards = [...playerCards].sort((a, b) => a.badLuckIndex - b.badLuckIndex);
    
    try {
      // Calls the handler function above
      await handleCardPlacement({
        position,
        gameEnded,
        newCard,
        sortedPlayerCards,
        setPlayerCards,
        setModalMsg,
        setShowModal,
        setGameEnded,
        isDemo: demoMode,
        setNewCard,
        loggedInUser
      });
    } catch (error) {
      // Handle session expiration for authenticated games
      if (!demoMode && error.message.includes('No active game session')) {
        setModalMsg('Game session expired. Starting a new game...');
        setShowModal(true);
      }
    }
  };
};

/**
 * Handle game timeout for both demo and authenticated game
 * To be used by createTimeoutHandler (the next function)
 */
async function handleGameTimeout({
  gameEnded,
  newCard,
  setModalMsg,
  setShowModal,
  setGameEnded,
  isDemo = false,
  loggedInUser
}) {
  // Only handle timeout if game is still active and there's a card to timeout
  if (!gameEnded && newCard) {
    if (isDemo) {
      // Demo timeout logic
      try {
        // Make API call to get card info
        await getCardBadLuckIndex(newCard.cardId);
        setModalMsg("Time's up! You lost!");
        setShowModal(true);
        setGameEnded(true); // Demo games end immediately on timeout
      } catch (error) {
        setModalMsg('Time\'s up! Error occurred while processing the timeout');
        setShowModal(true);
      }
      return;
    }
    
    // Regular game timeout logic
    try {
      // Send timeout to server - server will determine if game continues or ends
      const result = await handleCardTimeout(loggedInUser.id, newCard.cardId);
      
      // Display server's timeout message
      setModalMsg(result.gameResult.message);
      setShowModal(true);
      
      // Check if timeout caused game to end
      if (result.gameResult.gameEnded) {
        setGameEnded(true);
      }
    } catch (error) {
      setModalMsg('Time\'s up! Error occurred while processing the timeout');
      setShowModal(true);
    }
  }
}

/**
 * Handles timeout when player doesn't place card within time limit
 */
export const createTimeoutHandler = ({
  gameEnded,
  newCard,
  setModalMsg,
  setShowModal,
  setGameEnded,
  demoMode,
  loggedInUser
}) => {
  return () => {
    // Delegate to the actual timeout handling logic (function above)
    handleGameTimeout({
      gameEnded,
      newCard,
      setModalMsg,
      setShowModal,
      setGameEnded,
      isDemo: demoMode,
      loggedInUser
    });
  };
};

/**
 * Handles closing the result modal and continuing to next round
 */
export const createModalCloseHandler = ({
  setShowModal,
  gameEnded,
  fetchNewCard
}) => {
  return () => {
    // Always close the modal
    setShowModal(false);
    
    // If game is still ongoing, fetch next card for next round
    if (!gameEnded) {
      fetchNewCard();
    }
    // If game ended, no next card needed - player will see end game screen
  };
};

/**
 * Handles fetching a new card during gameplay
 */
export const createFetchNewCardHandler = ({
  playerCards,
  gameEnded,
  initialized,
  setNewCard,
  setNewCardLoading,
  setNewCardError,
  seenCardIds,
  setSeenCardIds
}) => {
  return () => {
    // Don't fetch if game is over, not initialized, or no player cards exist
    if (gameEnded || !initialized || playerCards.length === 0) return;
    
    // Create array of card IDs to exclude (player shouldn't get duplicate cards)
    const currentExcludeIds = seenCardIds;
    
    // Set loading state and clear any previous errors
    setNewCardLoading(true);
    setNewCardError(null);
    
    // Fetch new card from server, excluding all cards seen in this game
    getRandomCard(currentExcludeIds)
      .then(card => {
        // Successfully got new card
        setNewCard(card);
        // Track this new card as seen immediately when fetched
        setSeenCardIds(prev => [...prev, card.cardId]);
        setNewCardLoading(false);
      })
      .catch(err => {
        // Failed to get new card
        setNewCardError('Failed to fetch card');
        setNewCardLoading(false);
      });
  };
};

/**
 * Handles starting the game
 */
export const createStartGameHandler = ({
  initialized,
  playerCards,
  startGame,
  demoMode,
  loggedInUser,
  fetchNewCard,
  setModalMsg,
  setShowModal
}) => {
  return async () => {
    // Don't start if initial cards haven't loaded yet
    if (!initialized || playerCards.length === 0) return;
    
    try {
      // Use the game session hook's start game function
      // This will handle server session creation and fetch first card
      await startGame(playerCards, demoMode, loggedInUser, fetchNewCard);
    } catch (error) {
      // Show error if game failed to start
      setModalMsg(error.message);
      setShowModal(true);
    }
  };
};

/**
 * Handles playing again after game ends
 */
export const createPlayAgainHandler = ({
  resetGame,
  demoMode,
  loggedInUser,
  gameStarted,
  setNewCard,
  setShowModal,
  setModalMsg
}) => {
  return async () => {
    // Reset game state using the session hook (this will fetch new initial cards)
    await resetGame(demoMode, loggedInUser, gameStarted);
    
    // Clear current game UI state
    setNewCard(null);       // Clear the card that was being placed
    setShowModal(false);    // Close any open modal
    setModalMsg('');        // Clear modal message
    
    // Game will return to start screen with new initial cards
  };
};