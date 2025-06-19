const URI = 'http://localhost:3001/api'

// Authentication APIs

/**
 * Logs in a user with username and password
 */
async function logIn(credentials) {
    const bodyObject = {
        username: credentials.username,
        password: credentials.password
    }
    const response = await fetch(URI + `/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(bodyObject)
    })
    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        const err = await response.text()
        throw err;
    }
}

/**
 * Logs out the current user
 */
async function logout() {
    const response = await fetch(URI + `/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });
    if (response.ok)
        return null;
}

/**
 * Gets the currently authenticated user from session
 */
async function getCurrentUser() {
  const res = await fetch(URI + '/auth/session/current', {
    credentials: 'include'
  });

  if (!res.ok) throw new Error("Not authenticated");
  return res.json();
}

// Card APIs

/**
 * Gets a random card without bad luck index, optionally excluding specific cards
 */
async function getRandomCard(excludeIds = []) {
  const response = await fetch(URI + '/cards/random', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ excludeIds })
  });
  
  if (response.ok) {
    const card = await response.json();
    return card;
  } else {
    const err = await response.text();
    throw err;
  }
}

/**
 * Gets multiple unique random cards with bad luck index (for initial hand)
 */
async function getRandomCards(count) {
  const response = await fetch(URI + `/cards/random/${count}`);
  
  if (response.ok) {
    const cards = await response.json();
    return cards;
  } else {
    const err = await response.text();
    throw err;
  }
}

/**
 * Gets only the bad luck index for a specific card
 */
async function getCardBadLuckIndex(cardId) {
  const response = await fetch(URI + `/cards/${cardId}/bad-luck-index`);
  
  if (response.ok) {
    const data = await response.json();
    return data.badLuckIndex;
  } else {
    const err = await response.text();
    throw err;
  }
}

// Game History APIs

/**
 * Gets the authenticated user's game history
 */
async function getGameHistory() {
  const response = await fetch(URI + '/game-history', {
    credentials: 'include'
  });
  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Failed to fetch game history');
  }
}

/**
 * Saves a completed game result to history
 */
async function saveGameResult(gameData) {
  const response = await fetch(URI + '/game-history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(gameData)
  });
  if (response.ok) {
    return response.json();
  } else {
    const errText = await response.text();
    throw new Error(errText || 'Failed to save game result');
  }
}

// Game Session APIs

/**
 * Starts a new game session with initial cards
 */
async function startGameSession(initialCards) {
  const response = await fetch(URI + '/game-session/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ initialCards })
  });
  
  if (response.ok) {
    return response.json();
  } else {
    const err = await response.text();
    throw new Error(err || 'Failed to start game session');
  }
}

/**
 * Cancels the current game session
 */
async function cancelGameSession() {
  const response = await fetch(URI + '/game-session/cancel', {
    method: 'DELETE',
    credentials: 'include'
  });
  
  if (response.ok) {
    return response.json();
  } else {
    const err = await response.text();
    throw new Error(err || 'Failed to cancel game session');
  }
}

/**
 * Gets the current game session status
 */
async function getGameSessionStatus() {
  const response = await fetch(URI + '/game-session/status', {
    credentials: 'include'
  });
  
  if (response.ok) {
    return response.json();
  } else {
    const err = await response.text();
    throw new Error(err || 'Failed to get game session status');
  }
}

// Game Logic APIs

/**
 * Places a card at a specific position - handles both demo and authenticated games
 */
async function placeCard(userId, cardId, position, demoData = null) {
  const body = { userId, cardId, position };
  
  // Add demo-specific data if provided
  if (demoData?.isDemo) {
    body.isDemo = true;
    body.playerCards = demoData.playerCards;
  }
  
  const response = await fetch(URI + '/game-logic/place-card', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  
  if (response.ok) {
    return response.json();
  } else {
    const err = await response.text();
    throw new Error(err || 'Failed to place card');
  }
}

/**
 * Handles timeout when player doesn't place card in time
 */
async function handleCardTimeout(userId, cardId) {
  const response = await fetch(URI + '/game-logic/timeout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, cardId })
  });
  
  if (response.ok) {
    return response.json();
  } else {
    const err = await response.text();
    throw new Error(err || 'Failed to handle timeout');
  }
}

export { 
  logIn, logout, getCurrentUser, getRandomCard, getRandomCards,
  getCardBadLuckIndex, getGameHistory, saveGameResult,
  startGameSession, placeCard, handleCardTimeout, cancelGameSession, 
  getGameSessionStatus
};