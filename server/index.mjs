// imports
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { initAuth } from './src/middleware/auth.mjs';
import AuthRoutes from './src/routes/AuthRoutes.mjs';
import CardRoutes from './src/routes/CardRoutes.mjs';
import GameHistoryRoutes from './src/routes/GameHistoryRoutes.mjs';
import GameSessionRoutes from './src/routes/GameSessionRoutes.mjs';
import GameLogicRoutes from './src/routes/GameLogicRoutes.mjs';


// init express
const app = new express();
const port = 3001;

// cors configuration
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
};

// middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors(corsOptions));

// Serve static images from the public directory
app.use('/images', express.static('public'));

initAuth(app);

// routes
app.use('/api/auth', AuthRoutes);
app.use('/api/cards', CardRoutes);
app.use('/api/game-history', GameHistoryRoutes);
app.use('/api/game-session', GameSessionRoutes);
app.use('/api/game-logic', GameLogicRoutes);

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});