import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <div className="container">
        <div className="hero-section">
          <h1 className="hero-title">Welcome to Sudoku Game 🎮</h1>
          <p className="hero-subtitle">
            Challenge your mind with puzzles of varying difficulty levels
          </p>
          
          <div className="hero-actions">
            <Link to="/game" className="btn btn-primary btn-large">
              Start Playing
            </Link>
            <Link to="/leaderboard" className="btn btn-secondary btn-large">
              View Leaderboard
            </Link>
          </div>
        </div>

        <div className="features-section">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Multiple Difficulty Levels</h3>
              <p>Choose from Easy, Medium, Hard, or Expert puzzles</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⏱️</div>
              <h3>Track Your Time</h3>
              <p>See how fast you can solve puzzles and beat your records</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Hints Available</h3>
              <p>Get help when you're stuck with our hint system</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Leaderboard</h3>
              <p>Compete with other players and climb the rankings</p>
            </div>
          </div>
        </div>

        <div className="how-to-play-section">
          <h2>How to Play</h2>
          <div className="how-to-play-content">
            <ol>
              <li>Select a difficulty level to start a new game</li>
              <li>Click on an empty cell to select it</li>
              <li>Choose a number from 1-9 to fill the cell</li>
              <li>Fill the entire 9x9 grid following Sudoku rules:
                <ul>
                  <li>Each row must contain digits 1-9 without repetition</li>
                  <li>Each column must contain digits 1-9 without repetition</li>
                  <li>Each 3x3 box must contain digits 1-9 without repetition</li>
                </ul>
              </li>
              <li>Complete the puzzle as fast as you can to get a high score!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
