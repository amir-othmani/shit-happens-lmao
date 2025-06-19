import { Container, Button } from 'react-bootstrap';
import BadLuckCard from './BadLuckCard.jsx';

/**
 * Props received:
 * - title: string - The title to display at the top
 * - buttonText: string - Text for the start button
 * - sortedPlayerCards: array - Player's initial cards sorted by bad luck index
 * - onStart: function - Handler for when start button is clicked
 */
function StartScreen(props) {
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center h-100">
      <h2 className="mb-4">{props.title}</h2>
      <h3 className="text-muted mb-5" style={{ fontSize: "1.5em" }}>
          Please press one of the below buttons to make your guess
        </h3>
      <div className="d-flex flex-column align-items-center mb-4">
        <h4 className="mb-3">Your starting cards:</h4>
        
        {/* Card placement area with disabled buttons - same layout as GameBoard */}
        <div className="d-flex justify-content-center align-items-center flex-wrap" style={{ gap: '8px' }}>
          {/* First insertion button */}
          <Button
            variant="outline-primary"
            className="PickCardButton"
            disabled={true}
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
                disabled={true}
                title={`Place card at position ${index + 1}`}
              >
                +
              </Button>
            </div>
          ))}
        </div>
        
        
      </div>
      
      <Button 
        variant="success" 
        size="lg"
        onClick={props.onStart}
      >
        {props.buttonText}
      </Button>
    </Container>
  );
}

export default StartScreen;