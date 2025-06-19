import { useContext, useState } from 'react';
import { Container, Row, Col, Button, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router';
import UserContext from '../contexts/UserContext.jsx';
import { logout } from '../API/API.js';

function HomePage() {
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  const [logoutError, setLogoutError] = useState('');
  
  const handleLogout = async () => {
    try {
      setLogoutError(''); // Clear any previous error
      await logout();
      setLoggedInUser(null);
    } catch (error) {
      setLogoutError('Failed to logout properly. Please try again.');
    }
  };
  
  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white text-center">
              <h2 className="mb-0">🎮 Stuff Happens: PC Edition</h2>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="text-center">
                <h3 className="text-secondary mb-4">Because sometimes your computer just hates you</h3>
                <img 
                  src="/PC_happens.jpeg" 
                  alt="Stuff happens game" 
                  className="img-fluid mb-4"
                  style={{ maxHeight: '350px' }}
                />  
                <div className="lead mb-4">
                  <p className="mb-2">A fun, relatable card game where you can rank everyday PC-related problems based on how frustrating or annoying they are.</p>
                  <p className="mb-0">Place your cards wisely and see if you can beat the odds.</p>
                </div>
                
                <div className="text-center mt-4 pt-3 border-top">
                  {/* Alternatively display different buttons for guest or logged user */}
                  {loggedInUser === null ? (
                    <div>
                      <p className="text-muted mb-3">Welcome! Choose an option to get started:</p>
                      <div className="d-flex gap-2 flex-wrap justify-content-center">
                        <Link to="/demo">
                          <Button variant="success">Play demo</Button>
                        </Link>
                        <Link to="/instructions">
                          <Button variant="info">See instructions</Button>
                        </Link>
                        <Link to="/login">
                          <Button variant="primary">Login</Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-muted mb-3">Welcome back, <strong>{loggedInUser.username}</strong>!</p>
                      {logoutError && (
                        <Alert variant="danger" className="mb-3">
                          {logoutError}
                        </Alert>
                      )}
                      <div className="d-flex gap-2 flex-wrap justify-content-center">
                        <Link to="/game">
                          <Button variant="primary">Play</Button>
                        </Link>
                        <Link to="/profile">
                          <Button variant="info">Profile page</Button>
                        </Link>
                        <Button variant="secondary" onClick={handleLogout}>
                          Logout
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;