import { addGameToHistory } from '../dao/GameHistoryDao.mjs';
import { addCardToGame } from '../dao/CardPerGameDao.mjs';

class GameSessionService {
  constructor() {
    // In-memory storage for active game sessions
    // Key: userId, Value: game session data
    this.activeSessions = new Map();
  }

  // Start a new game session
  async startGame(userId, initialCards) {
    const processedInitialCards = initialCards.map(card => ({
      cardId: card.cardId,
      round: null, // Initial cards have no round
      wonCard: null // Initial cards are neither won nor lost
    }));

    // This object will keep track of the game progress
    const gameSession = {
      userId,
      startTime: Date.now(),
      initialCards: processedInitialCards,
      rounds: [], // Will store each round's card info
      currentRound: 1,
      gameEnded: false,
      wonGame: false
    };

    this.activeSessions.set(userId, gameSession);
    return { success: true, sessionId: userId };
  }

  // Add a round to the game session
  addRound(userId, cardId, wonCard) {
    const session = this.activeSessions.get(userId);

    if (!session || session.gameEnded) {
      throw new Error('No active game session found');
    }

    const roundInfo = {
      cardId,
      round: session.currentRound,
      wonCard
    };

    session.rounds.push(roundInfo);
    session.currentRound += 1;

    return { success: true, round: session.currentRound - 1 };
  }

  // End the game session and prepare for database save
  endGame(userId, wonGame) {
    const session = this.activeSessions.get(userId);
    if (!session) {
      throw new Error('No active game session found');
    }

    session.gameEnded = true;
    session.wonGame = wonGame;
    session.endTime = Date.now();

    // Prepare complete game data for database
    const allCards = [...session.initialCards, ...session.rounds];

    const completeGameData = {
      userId: session.userId,
      dateGame: session.startTime,
      wonGame: session.wonGame,
      cards: allCards
    };

    // Remove from memory after preparing data
    this.activeSessions.delete(userId);
    
    return completeGameData;
  }

  // Get current game session
  getSession(userId) {
    return this.activeSessions.get(userId);
  }

  // Cancel/abandon game session
  cancelGame(userId) {
    const wasActive = this.activeSessions.has(userId);
    this.activeSessions.delete(userId);
    return { success: true, wasActive };
  }

  // Move saveCompleteGame from GameService to here
  async saveCompleteGame(userId, dateGame, wonGame, cards) {
    try {
      // First, save the game history
      const gameResult = await addGameToHistory(userId, dateGame, wonGame);
      const gameId = gameResult.gameId;

      // Then, save all card information for this game
      if (cards && cards.length > 0) {
        const cardPromises = cards.map(cardInfo => 
          addCardToGame(gameId, cardInfo.cardId, cardInfo.round, cardInfo.wonCard)
        );
        // Wait for all card insertions to complete
        await Promise.all(cardPromises);
      }

      return { gameId, message: 'Game and cards saved successfully' };
    }
    
    catch (error) {
      throw new Error(`Failed to save complete game: ${error.message}`);
    }
  }
}

export default new GameSessionService();