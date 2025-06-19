import { Button, Modal } from 'react-bootstrap';

/**
 * Props received:
 * - show: boolean - Whether to show the modal
 * - onHide: function - Handler for hiding the modal
 * - title: string - Title for the modal header
 * - message: string - Message to display in modal body
 * - isGameEnded: boolean - Whether the game has ended
 * - demoMode: boolean - Whether this is demo mode
 */
function GameModal(props) {
  const getButtonText = () => {
    // If it's demo mode or game has ended, show "Close"
    if (props.demoMode || props.isGameEnded) {
      return "Close";
    }
    // If it's an ongoing game, show "Start a new round"
    return "Start a new round";
  };

  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{props.isGameEnded ? "Game Over" : props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.message}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={props.onHide}>
          {getButtonText()}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default GameModal;