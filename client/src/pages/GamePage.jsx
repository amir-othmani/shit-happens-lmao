import GameBoard from "../components/GameBoard.jsx";
import GameModal from "../components/GameModal.jsx";
import StartScreen from "../components/StartScreen.jsx";
import { useContext } from 'react';
import '../CustomStyles/CustomStyles.css';
import UserContext from '../contexts/UserContext.jsx'; 
import { useGameState, useGameModal, useNewCard, useGameSession } from '../hooks/GameHooks.jsx';
import { 
  createPlaceCardHandler, 
  createTimeoutHandler, 
  createModalCloseHandler,
  createFetchNewCardHandler,
  createStartGameHandler,
  createPlayAgainHandler
} from '../handlers/GameHandlers.js';

/**
 * Props received:
 * - demoMode: boolean - Whether this is demo mode or regular authenticated game
 */
function GamePage(props) {
  // Get current logged-in user from context (only needed for authenticated games)
  const { loggedInUser } = useContext(UserContext);
  
  // Custom hooks for game state management
  const { gameStarted, gameKey, startGame, resetGame } = useGameSession();
  
  // Fetches initial player cards and manages game state
  const {
    playerCards,
    setPlayerCards,
    seenCardIds,
    setSeenCardIds,
    initialized,
    gameEnded,
    setGameEnded,
    playerLoading,
    playerError
  } = useGameState(gameKey);

  // Custom hooks for modal state
  const { 
    showModal,
    setShowModal,
    modalMsg,
    setModalMsg
  } = useGameModal();

  // Custom hook for new card state (state only)
  const {
    newCard,
    setNewCard,
    newCardLoading,
    setNewCardLoading,
    newCardError,
    setNewCardError
  } = useNewCard(gameKey);

  // Handler to fetch a new card
  const fetchNewCard = createFetchNewCardHandler({
    playerCards,
    gameEnded,
    initialized,
    setNewCard,
    setNewCardLoading,
    setNewCardError,
    seenCardIds,
    setSeenCardIds
  });

  // Handler to start a new game
  const handleStartGame = createStartGameHandler({
    initialized,
    playerCards,
    startGame,
    demoMode: props.demoMode,
    loggedInUser,
    fetchNewCard,
    setModalMsg,
    setShowModal
  });

  // Handler to place a card on the game board
  const handlePlaceCard = createPlaceCardHandler({
    playerCards,
    gameEnded,
    newCard,
    setPlayerCards,
    setModalMsg,
    setShowModal,
    setGameEnded,
    demoMode: props.demoMode,
    setNewCard,
    loggedInUser
  });

  // Handler for timeout
  const handleTimeout = createTimeoutHandler({
    gameEnded,
    newCard,
    setModalMsg,
    setShowModal,
    setGameEnded,
    demoMode: props.demoMode,
    loggedInUser
  });

  // Handler to close modal
  const handleModalClose = createModalCloseHandler({
    setShowModal,
    gameEnded,
    fetchNewCard
  });

  // Handler to play again after game ends
  const handlePlayAgain = createPlayAgainHandler({
    resetGame,
    demoMode: props.demoMode,
    loggedInUser,
    gameStarted,
    setNewCard,
    setShowModal,
    setModalMsg
  });

  // Loading state - show while initial cards are being fetched
  if (playerLoading || (!initialized && newCardLoading)) {
    return <div className="m-4">Loading...</div>;
  }
  
  // Error state - show if initial cards failed to load
  if (playerError) {
    return <div className="m-4">Error: {playerError}</div>;
  }
  
  // New card error state - show if new card failed to load during gameplay
  if (newCardError && gameStarted && !gameEnded) {
    return <div className="m-4">Error fetching new card: {newCardError}</div>;
  }

  // Sort player cards by bad luck index for consistent display
  const sortedPlayerCards = [...playerCards].sort((a, b) => a.badLuckIndex - b.badLuckIndex);

  // Pre-game screen - show start screen with initial cards before game begins
  if (!gameStarted) {
    return (
      <StartScreen
        title={props.demoMode ? "Demo Mode - Ready to Play?" : "Ready to Play?"}
        buttonText={props.demoMode ? "Start Demo" : "Start Game"}
        sortedPlayerCards={sortedPlayerCards}
        onStart={handleStartGame}
      />
    );
  }

  // Main game interface - show game board and modal
  return (
    <div className="h-100 d-flex flex-column">
      {/* Result modal - shows game results */}
      <GameModal
        show={showModal}
        onHide={handleModalClose}
        title="Result"
        message={modalMsg}
        isGameEnded={gameEnded}
        demoMode={props.demoMode}
      />

      {/* Main game board - displays cards and handles game interactions */}
      <GameBoard
        sortedPlayerCards={sortedPlayerCards}
        newCard={newCard}
        handlePlaceCard={handlePlaceCard}
        showModal={showModal}
        setShowModal={setShowModal}
        modalMsg={modalMsg}
        gameEnded={gameEnded}
        demoMode={props.demoMode}
        handleTimeout={handleTimeout}
        isLoadingNewCard={newCardLoading && !gameEnded}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  );
}

export default GamePage;