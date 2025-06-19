import { getCardBadLuckIndex } from '../dao/CardDao.mjs';
import GameSessionService from './GameSessionService.mjs';

class GameLogicService {
  // Validate card placement and update game state
  async validateAndPlaceCard(userId, cardId, position, playerCards = null) {
    const session = GameSessionService.getSession(userId);
    
    // If no session but playerCards provided, treat as demo mode
    if (!session && !playerCards) {
      throw new Error('No active game session found');
    }
    
    // Get the card's bad luck index
    const badLuckIndex = await getCardBadLuckIndex(cardId);
    if (badLuckIndex === null) {
      throw new Error('Card not found');
    }

    let currentPlayerCards;
    let isDemo = false;

    // Enters if the game is still active
    if (session && !session.gameEnded) {
      // Regular game mode - get all cards in player's hand with their bad luck indices
      const initialCardIds = session.initialCards.map(card => card.cardId);
      const wonCardIds = session.rounds.filter(round => round.wonCard === true).map(round => round.cardId);
      const allPlayerCardIds = [...initialCardIds, ...wonCardIds];
      
      // Fetch bad luck indices for all player cards
      currentPlayerCards = await Promise.all(
        allPlayerCardIds.map(async (cardId) => {
          const badLuckIndex = await getCardBadLuckIndex(cardId);
          return { cardId, badLuckIndex };
        })
      );
    }
    else if (playerCards) {
      // Demo mode - use provided player cards
      currentPlayerCards = playerCards;
      isDemo = true;
    }
    else {
      throw new Error('No active game session found');
    }

    // Sort by badLuckIndex for validation
    currentPlayerCards.sort((a, b) => a.badLuckIndex - b.badLuckIndex);

    // Validate placement
    const isValidPlacement = this.validateCardPosition(currentPlayerCards, badLuckIndex, position);
    
    if (!isDemo) {
      // Only update session for regular games
      GameSessionService.addRound(userId, cardId, isValidPlacement);
    }

    // Check game end conditions
    let gameResult = null;     // NB: gameResult isn't the result of an entire game, it is just the result of a guess attempt
    if (isDemo) {
      // Demo always ends after one round
      if (isValidPlacement) {
        gameResult = { gameEnded: true, wonGame: true, message: "You guessed it right. You won!" };
      } else {
        gameResult = { gameEnded: true, wonGame: false, message: "You didn't guess it right. You lost!" };
      }
    } else {
      // Regular game logic
      if (isValidPlacement) {
        // Only won cards are added to totalCards
        const totalCards = 3 + session.rounds.filter(r => r.wonCard === true).length;
        // Checks if the game is already won or has to continue
        if (totalCards === 6) {
          gameResult = { gameEnded: true, wonGame: true, message: "Congratulations! You won!" };
        }
        else {
          gameResult = { gameEnded: false, wonGame: false, message: "You guessed it right!" };
        }
      }
      
      else {
        // In order to count the lost rounds, only lost cards should be considered
        const lostRounds = session.rounds.filter(r => r.wonCard === false).length;
        // Checks if the game is already lost or has to continue
        if (lostRounds === 3) {
          gameResult = { gameEnded: true, wonGame: false, message: "Game over! You lost!" };
        }
        else {
          gameResult = { gameEnded: false, wonGame: false, message: "You didn't guess it right. Try again with a new card!" };
        }
      }
    }

    return {
      success: true,
      isValidPlacement,
      gameResult,
      round: isDemo ? 1 : (session.currentRound - 1),   // -1 because there was an addRound earlier
      badLuckIndex,
      isDemo
    };
  }

  // Validate if a card can be placed at a specific position
  validateCardPosition(sortedPlayerCards, newCardBadLuckIndex, position) {
    // Check left neighbor (if new card is smaller than the left card, it returns false)
    if (position > 0 && newCardBadLuckIndex < sortedPlayerCards[position - 1].badLuckIndex) {
      return false;
    }
    
    // Check right neighbor (if new card is bigger than the right card, it returns false)
    if (position < sortedPlayerCards.length && newCardBadLuckIndex > sortedPlayerCards[position].badLuckIndex) {
      return false;
    }
    
    return true;
  }

  // Handle timeout (card is automatically lost)
  async handleTimeout(userId, cardId, isDemo = false) {
    const session = GameSessionService.getSession(userId);
    
    if (!session && !isDemo) {
      throw new Error('No active game session found');
    }
    
    if (session && session.gameEnded) {
      throw new Error('No active game session found');
    }

    if (!isDemo && session) {
      // Only update session for regular games
      GameSessionService.addRound(userId, cardId, false);
    }

    // Check game end conditions
    let gameResult = null;
    
    if (isDemo) {
      // Demo always ends on timeout
      gameResult = { gameEnded: true, wonGame: false, message: "Time's up! You lost!" };
    }
    else {
      // Regular game logic
      const lostRounds = session.rounds.filter(r => r.wonCard === false).length;
      if (lostRounds === 3) {
        gameResult = { gameEnded: true, wonGame: false, message: "Time's up! Game over! You lost!" };
      }
      else {
        gameResult = { gameEnded: false, wonGame: false, message: "Time's up! You lost this round. Try again with a new card!" };
      }
    }

    return {
      success: true,
      gameResult,
      round: isDemo ? 1 : (session.currentRound - 1),   // -1 because there was an addRound earlier
      isDemo
    };
  }
}

export default new GameLogicService();