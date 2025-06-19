import 'bootstrap/dist/css/bootstrap.min.css'
import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router' 
import './App.css'
import UserContext from './contexts/UserContext.jsx'
import LoginPage from './pages/LoginPage.jsx'
import HomePage from './pages/HomePage.jsx'
import InstructionsPage from './pages/InstructionsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import GamePage from './pages/GamePage.jsx';
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import { getCurrentUser } from './API/API.js';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Check if user is already logged in on app start
  useEffect(() => {
    getCurrentUser()
      .then(user => setLoggedInUser(user))
      .catch(() => setLoggedInUser(null));
  }, []);

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        
        <div className="flex-grow-1">
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/instructions' element={<InstructionsPage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/demo' element={<GamePage demoMode={true} />} />
            <Route path='/game' element={<GamePage demoMode={false} />} />
          </Routes>
        </div>
        
        <Footer />
      </div>
    </UserContext.Provider>
  );
}

export default App;
