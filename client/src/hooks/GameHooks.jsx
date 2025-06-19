import { useState, useEffect, useRef } from 'react';
import { getRandomCards, startGameSession, cancelGameSession } from '../API/API.js';

const INITIAL_CARDS = 3;

// Hook to manage game state
export const useGameState = (gameKey = 0) => {
  const [playerCards, setPlayerCards] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [playerLoading, setPlayerLoading] = useState(true);
  const [playerError, setPlayerError] = useState(null);

  // Reset state when gameKey changes
  useEffect(() => {
    if (gameKey > 0) {
      setPlayerCards([]);
      setInitialized(false);
      setGameEnded(false);
      setPlayerLoading(true);
      setPlayerError(null);
    }
  }, [gameKey]);

  // Fetch initial cards
  useEffect(() => {
    setPlayerLoading(true);
    setPlayerError(null);
    
    getRandomCards(INITIAL_CARDS)
      .then(cards => {
        setPlayerCards(cards);
        setInitialized(true);
        setPlayerLoading(false);
      })
      .catch(err => {
        setPlayerError('Failed to fetch cards');
        setPlayerLoading(false);
      });
  }, [gameKey]);

  return {
    playerCards,
    setPlayerCards,
    initialized,
    gameEnded,
    setGameEnded,
    playerLoading,
    playerError
  };
};

// Hook to manage modal state
export const useGameModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  return {
    showModal,
    setShowModal,
    modalMsg,
    setModalMsg
  };
};

// Hook to manage new card state (state only)
export const useNewCard = (gameKey) => {
  const [newCard, setNewCard] = useState(null);
  const [newCardLoading, setNewCardLoading] = useState(false);
  const [newCardError, setNewCardError] = useState(null);

  // Reset new card state when starting a new game
  useEffect(() => {
    if (gameKey > 0) {
      setNewCard(null);
      setNewCardError(null);
      setNewCardLoading(false);
    }
  }, [gameKey]);

  return {
    newCard,
    setNewCard,
    newCardLoading,
    setNewCardLoading,
    newCardError,
    setNewCardError
  };
};

// Hook to manage game session state
export const useGameSession = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  const startGame = async (playerCards, demoMode, loggedInUser, fetchNewCard) => {
    // Ensure we have initial cards loaded
    if (playerCards.length === 0) return;
    
    // For authenticated games, ensure user is logged in
    if (!demoMode && !loggedInUser) return;
    
    try {
      // For authenticated games, start a server session with initial cards
      if (!demoMode) {
        await startGameSession(playerCards);
      }
      
      // Mark game as started and fetch the first card to place
      setGameStarted(true);
      fetchNewCard();
    } catch (error) {
      throw new Error('Failed to start game. Please try again.');
    }
  };

  const resetGame = async (demoMode, loggedInUser, gameStarted) => {
    // For authenticated games, cancel the current server session
    if (!demoMode && loggedInUser && gameStarted) {
      try {
        await cancelGameSession();
      } catch (error) {
      }
    }
    
    // Reset game state
    setGameStarted(false);
    
    // Increment gameKey to trigger useGameState hook to fetch new initial cards
    setGameKey(prev => prev + 1);
  };

  return {
    gameStarted,
    setGameStarted,
    gameKey,
    startGame,
    resetGame
  };
};

// Hook to manage game timer
export const useGameTimer = (newCard, showModal, gameEnded, isLoadingNewCard, handleTimeout, timerDuration = 15) => {
  const [timer, setTimer] = useState(timerDuration);
  const timeoutHandled = useRef(false);

  // Start/reset timer only when modal is closed and a new card is present
  useEffect(() => {
    timeoutHandled.current = false;
    
    // Only run timer if modal is closed, game not ended, newCard exists, and not loading
    if (showModal || !newCard || gameEnded || isLoadingNewCard) {
      return;
    }

    setTimer(timerDuration); // Reset timer at the start of a round

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          // Timer will reach 0, handle timeout
          if (!timeoutHandled.current) {
            timeoutHandled.current = true;
            handleTimeout && handleTimeout();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [newCard, showModal, gameEnded, handleTimeout, isLoadingNewCard, timerDuration]);

  return timer;
};