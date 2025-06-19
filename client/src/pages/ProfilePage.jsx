import { useContext, useEffect, useState } from 'react';
import { Container, Card, Table, Spinner, Alert } from 'react-bootstrap';
import UserContext from '../contexts/UserContext.jsx';
import HomeButton from '../components/HomeButton.jsx';
import { getGameHistory } from '../API/API.js';

function ProfilePage() {
  const { loggedInUser } = useContext(UserContext);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getGameHistory()
      .then(setGames)
      .catch(() => setError('Failed to load game history'))
      .finally(() => setLoading(false));
  }, [loggedInUser]);

  return (      
    <Container className="my-4">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-11">
          {/* User Info Card */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-primary text-white text-center">
              <h2 className="mb-0">👤 User Profile</h2>
            </Card.Header>
            <Card.Body className="p-4">
              <div>
                {loggedInUser && <p>User info: You are logged in as <strong>{loggedInUser.username}</strong></p>}
              </div>
            </Card.Body>
          </Card>

          {/* Game History Card */}
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary text-white">
              <h3 className="mb-0">📊 Game History</h3>
            </Card.Header>
            <Card.Body className="p-4">
              {loading && (
                <div className="text-center py-3">
                  <Spinner animation="border" />
                </div>
              )}
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              {!loading && !error && (
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead className="table-dark">
                      <tr>
                        <th>Date & Time</th>
                        <th>Won?</th>
                        <th>Initial Cards</th>
                        <th>Cards Played</th>
                      </tr>
                    </thead>
                    <tbody>
                      {games.map(game => {
                        const initialCards = game.cards?.filter(c => c.round === null) || [];
                        const playedCards = game.cards?.filter(c => c.round !== null) || [];
                        
                        return (
                          <tr key={game.gameId}>
                            <td>{game.dateGame}</td>
                            <td>{game.wonGame ? 'Yes' : 'No'}</td>
                            <td>
                              <ul style={{paddingLeft: '1em', margin: 0}}>
                                {initialCards.map((c, idx) => (
                                  <li key={idx}>
                                    {c.situationName || `Card ${c.card}`}
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td>
                              <ul style={{paddingLeft: '1em', margin: 0}}>
                                {playedCards.map((c, idx) => (
                                  <li key={idx}>
                                    <strong>{c.situationName || `Card ID: ${c.card}`}</strong>
                                    <br />
                                    Round: {c.round}, 
                                    Won: {c.wonCard ? 'Yes' : 'No'}
                                  </li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              )}
              
              <div className="text-center mt-4 pt-3 border-top">
                <HomeButton />
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default ProfilePage;