[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/ArqHNgsV)
# Exam #1: "Stuff Happens: PC Edition"
## Student: s344108 OTHMANI AMIR 

## React Client Application Routes

- Route `/`: HomePage - Main landing page with game description and navigation options for guests/logged users
- Route `/login`: LoginPage - User authentication form for logging into the system
- Route `/instructions`: InstructionsPage - Detailed game rules and how-to-play guide
- Route `/profile`: ProfilePage - User profile showing game history and statistics (authenticated users only)
- Route `/demo`: GamePage (demo mode) - Single-round demo game for guests to try the game
- Route `/game`: GamePage (full mode) - Complete game experience for authenticated users

## API Server

### Authentication APIs
- POST `/api/auth/login`
  - request body: `{ username: string, password: string }`
  - response: user object `{ id: number, username: string }` or 401 error
- POST `/api/auth/logout`
  - no request parameters
  - response: empty response
- GET `/api/auth/session/current`
  - no request parameters
  - response: current user object or 401 if not authenticated

### Card APIs
- GET `/api/cards/random/:count`
  - request parameters: `count` (number of cards, must be 3)
  - response: array of initial cards with bad luck indices
- POST `/api/cards/random`
  - request body: `{ excludeIds: number[] }` (cards to exclude)
  - response: single random card without bad luck index
- GET `/api/cards/:id/bad-luck-index`
  - request parameters: `id` (card ID)
  - response: `{ badLuckIndex: number }`

### Game Session APIs
- POST `/api/game-session/start`
  - request body: `{ initialCards: Card[] }` (authenticated users only)
  - response: `{ success: boolean, sessionId: number }`
- DELETE `/api/game-session/cancel`
  - no request parameters (authenticated users only)
  - response: `{ success: boolean, wasActive: boolean }`
- GET `/api/game-session/status`
  - no request parameters (authenticated users only)
  - response: current game session status

### Game Logic APIs
- POST `/api/game-logic/place-card`
  - request body: `{ userId: number, cardId: number, position: number, isDemo?: boolean, playerCards?: Card[] }`
  - response: game result with placement validation and end game status
- POST `/api/game-logic/timeout`
  - request body: `{ userId: number, cardId: number }`
  - response: timeout handling result

### Game History APIs
- GET `/api/game-history`
  - no request parameters (authenticated users only)
  - response: array of user's game history with cards played
- POST `/api/game-history`
  - request body: `{ userId: number, dateGame: number, wonGame: boolean, cards: Card[] }`
  - response: saved game confirmation

## Database Tables

- Table `user` - contains user_id, username, salted_password, salt for user authentication
- Table `card` - contains card_id, bad_luck_index, situation_name, image for PC problem scenarios
- Table `game_history` - contains game_id, player, date_game, won_game for tracking completed games
- Table `card_per_game` - contains game, card, round, won_card for tracking cards played in each game

## Main React Components

- `GamePage` (in `GamePage.jsx`): Main game component handling both demo and authenticated game modes
- `GameBoard` (in `GameBoard.jsx`): Game interface showing current cards, timer, and placement options
- `BadLuckCard` (in `BadLuckCard.jsx`): Card component displaying situation, image, and bad luck index
- `StartScreen` (in `StartScreen.jsx`): Pre-game screen showing initial cards and start button
- `GameModal` (in `GameModal.jsx`): Modal for displaying round results and game end messages
- `HomePage` (in `HomePage.jsx`): Landing page with different options for guests vs logged users
- `LoginForm` (in `LoginForm.jsx`): Authentication form component with username/password inputs
- `ProfilePage` (in `ProfilePage.jsx`): User profile displaying game history in a formatted table

## Screenshot

![Screenshot-game](./Readme%20images/screenshot-game.png)
![Screenshot-history](./Readme%20images/screenshot-history.png)

## Users Credentials

- user1, password
- user2, password123
