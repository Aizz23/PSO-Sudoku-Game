import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Game from './pages/Game';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        <ToastContainer position="top-right" autoClose={3000} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/game"
            element={user ? <Game user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={
              user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
            }
          />
          <Route
            path="/register"
            element={
              user ? <Navigate to="/" /> : <Register onLogin={handleLogin} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

//  add Navigate and useNavigate if necessary, but make sure to import them from 'react-router-dom' AND CALL THEM