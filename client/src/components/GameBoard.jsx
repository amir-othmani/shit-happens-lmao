import BadLuckCard from "./BadLuckCard";
import { Button } from "react-bootstrap";
import HomeButton from "./HomeButton.jsx";
import { useGameTimer } from "../hooks/GameHooks.jsx";

/**
 * Props received:
 * - sortedPlayerCards: array - Player's cards sorted by bad luck index
 * - newCard: object - The new card to be placed
 * - handlePlaceCard: function - Handler for placing a card at a position
 * - showModal: boolean - Whether to show the result modal
 * - setShowModal: function - State setter for modal visibility
 * - modalMsg: string - Message to display in modal
 * - gameEnded: boolean - Whether the game has ended
 * - demoMode: boolean - Whether this is demo mode
 * - handleTimeout: function - Handler for when timer runs out
 * - isLoadingNewCard: boolean - Whether a new card is being loaded
 * - onPlayAgain: function - Handler for play again button
 */
function GameBoard(props) {
  // Use custom hook to manage the game timer
  const timer = useGameTimer(props.newCard, props.showModal, props.gameEnded, props.isLoadingNewCard, props.handleTimeout);

  return (
    <div className="h-100 d-flex flex-column">
      <div className="flex-fill d-flex flex-column justify-content-center align-items-center p-4">
        {props.gameEnded ? (
          <div className="text-center">
            {props.demoMode ? (
              // Demo mode end screen - limited functionality, encourages login
              <>
                <h3 className="mb-3">
                  {/* Win condition demo mode */}
                  {props.sortedPlayerCards.length === 4 ? "You won!" : "You lost!"}
                </h3>
                <p className="mb-4 text-muted" style={{ fontSize: "1.1em" }}>
                  Login to play a full game
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  {/* Play again button for demo mode */}
                  {props.onPlayAgain && (
                    <Button variant="success" onClick={props.onPlayAgain}>
                      Play Again
                    </Button>
                  )}
                  <HomeButton />
                </div>
              </>
            ) : (
              // Regular game mode end screen - full functionality
              <>
                <h3 className="mb-4">
                  {/* In regular mode, win condition is reaching 6 cards */}
                  {props.sortedPlayerCards.length === 6 ? "Congratulations! You won!" : "Game Over! You lost!"}
                </h3>
                <div className="d-flex gap-3 justify-content-center">
                  {/* Play again button for authenticated users */}
                  {props.onPlayAgain && (
                    <Button variant="success" onClick={props.onPlayAgain}>
                      Play Again
                    </Button>
                  )}
                  <HomeButton />
                </div>
              </>
            )}
          </div>
        ) : (
          // Active game screen - shows new card to be placed and timer
          <>
            <h3 className="text-center mb-3">New card</h3>
            
            {/* Timer display - shows countdown or loading state */}
            <div className="mb-2">
              <span className="badge bg-secondary" style={{ fontSize: "1.2em" }}>
                {props.isLoadingNewCard ? "Loading..." : `Time left: ${timer}s`}
              </span>
            </div>
            
            {/* Display the new card if it exists and isn't loading */}
            {props.newCard && !props.isLoadingNewCard && (
              <BadLuckCard
                badLuckIndex={props.newCard.badLuckIndex}
                situationName={props.newCard.situationName}
                image={props.newCard.image}
                showBadLuckIndex={false} // Don't show index on new card to avoid spoilers
              />
            )}
            
            {/* Loading spinner while fetching new card */}
            {props.isLoadingNewCard && (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Bottom section - displays player's current cards with placement buttons */}
      <div className="flex-fill d-flex flex-column justify-content-center p-4">
        <h3 className="text-center mb-3">Your cards</h3>
        
        {/* Card placement area */}
        <div className="d-flex justify-content-center align-items-center flex-wrap" style={{ gap: '8px' }}>
          {/* First insertion button */}
          <Button
            variant="outline-primary"
            className="PickCardButton"
            onClick={() => props.handlePlaceCard(0)}
            disabled={props.gameEnded || props.isLoadingNewCard || !props.newCard}
            title="Place card at position 0"
          >
            +
          </Button>
          
          {props.sortedPlayerCards.map((card, index) => (
            <div key={`card-${index}`} className="d-flex align-items-center" style={{ gap: '8px' }}>
              {/* The actual player card */}
              <BadLuckCard
                badLuckIndex={card.badLuckIndex}
                situationName={card.situationName}
                image={card.image}
                showBadLuckIndex={true}
              />
              
              {/* Insertion button after each card */}
              <Button
                variant="outline-primary"
                className="PickCardButton"
                onClick={() => props.handlePlaceCard(index + 1)}
                disabled={props.gameEnded || props.isLoadingNewCard || !props.newCard}
                title={`Place card at position ${index + 1}`}
              >
                +
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GameBoard;