import HomeButton from '../components/HomeButton.jsx';
import { Container, Row, Col, Card } from 'react-bootstrap';

function InstructionsPage() {
  return (      
    <Container className="my-3">
      <Row className="justify-content-center">
        <Col md={10} lg={11}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white text-center">
              <h2 className="mb-0">📚 How to Play</h2>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="mb-4">
                <h3 className="text-secondary mb-3">🎯 Game Overview</h3>
                <p className="lead">
                  In <strong>Stuff Happens: PC Edition</strong>, you'll draw cards that describe frustrating or 
                  awkward computer-related situations like "Accidentally deleted an important file" or 
                  "Mic didn't work during a meeting."
                </p>
              </div>

              <div className="mb-4">
                <h3 className="text-secondary mb-3">📊 Bad Luck Index</h3>
                <p>
                  Each card has a Bad Luck Index rating from <strong>0.5 to 99.5</strong>, based on how 
                  annoying that scenario is. The higher the number, the more frustrating the situation!
                </p>
              </div>

              <div className="mb-4">
                <h3 className="text-secondary mb-3">🎮 How to Play</h3>
                <p>
                  The goal is to correctly place your new card in the correct position within a 
                  growing line of already-revealed cards, based on its frustration level.
                </p>
                <p>
                  Each round you draw a new card and you can try to guess where it fits in the line. 
                  If you're right, you keep the card; if not, it gets discarded.
                </p>
              </div>

              <div className="mb-4">
                <h3 className="text-secondary mb-3">🏆 Winning & Losing</h3>
                <p>
                  You start with <span className="badge bg-info">3 cards</span> and you win if you 
                  manage to finish the game with <span className="badge bg-success">6 cards</span> in your hand.
                </p>
                <p className="text-warning">
                  <strong>⚠️ But be careful!</strong> If you guess wrong <span className="badge bg-danger">3 times</span>, 
                  you lose the game!
                </p>
              </div>

              <div className="text-center mt-4 pt-3 border-top">
                <p className="text-muted mb-3">Ready to test your intuition?</p>
                <HomeButton />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default InstructionsPage;