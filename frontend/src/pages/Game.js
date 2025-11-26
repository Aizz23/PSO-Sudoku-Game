import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SudokuBoard from '../components/SudokuBoard';
import NumberPad from '../components/NumberPad';
import { puzzleAPI, gameAPI } from '../services/api';
import './Game.css';

const Game = ({ user }) => {
  const [difficulty, setDifficulty] = useState('medium');
  const [puzzle, setPuzzle] = useState(null);
  const [solution, setSolution] = useState(null);
  const [currentState, setCurrentState] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameId, setGameId] = useState(null);
  const [timer, setTimer] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [loading, setLoading] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval;
    if (gameStarted && !gameCompleted) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameCompleted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startNewGame = async () => {
    try {
      setLoading(true);
      const response = await puzzleAPI.generate(difficulty);
      const { puzzle: newPuzzle, solution: newSolution } = response.data.data;

      setPuzzle(newPuzzle);
      setSolution(newSolution);
      setCurrentState(newPuzzle.map(row => [...row]));
      setGameStarted(true);
      setTimer(0);
      setHintsUsed(0);
      setGameCompleted(false);
      setSelectedCell(null);
      setSelectedNumber(null);

      // Create game in database
      const gameResponse = await gameAPI.create({
        puzzle: newPuzzle,
        solution: newSolution,
        difficulty,
        userId: user?.id,
        username: user?.username || 'Guest',
      });

      setGameId(gameResponse.data.data._id);
      toast.success('New game started! Good luck! 🎮');
    } catch (error) {
      console.error('Error starting game:', error);
      toast.error('Failed to start game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col });
  };

  const handleNumberSelect = (num) => {
    setSelectedNumber(num);
    
    if (selectedCell && num) {
      const { row, col } = selectedCell;
      
      // Check if cell is editable
      if (puzzle[row][col] === '-' || puzzle[row][col] === '0') {
        const newState = currentState.map(r => [...r]);
        newState[row][col] = num.toString();
        setCurrentState(newState);

        // Check if puzzle is complete
        checkCompletion(newState);
      }
    } else if (selectedCell && num === null) {
      // Erase cell
      const { row, col } = selectedCell;
      if (puzzle[row][col] === '-' || puzzle[row][col] === '0') {
        const newState = currentState.map(r => [...r]);
        newState[row][col] = '-';
        setCurrentState(newState);
      }
    }
  };

  const checkCompletion = (state) => {
    const isFilled = state.every(row => 
      row.every(cell => cell !== '-' && cell !== '0')
    );

    if (isFilled) {
      const isCorrect = state.every((row, rowIndex) =>
        row.every((cell, colIndex) => cell === solution[rowIndex][colIndex])
      );

      if (isCorrect) {
        completeGame();
      }
    }
  };

  const completeGame = async () => {
    setGameCompleted(true);
    setGameStarted(false);

    try {
      await gameAPI.update(gameId, {
        currentState,
        status: 'completed',
        timeElapsed: timer,
        hintsUsed,
      });

      toast.success(`🎉 Congratulations! You completed the puzzle in ${formatTime(timer)}!`);
    } catch (error) {
      console.error('Error completing game:', error);
    }
  };

  const getHint = async () => {
    if (hintsUsed >= 3) {
      toast.warning('Maximum hints used (3)');
      return;
    }

    try {
      const response = await puzzleAPI.getHint(currentState, solution);
      const hint = response.data.data;

      if (!hint) {
        toast.info('Puzzle is already complete!');
        return;
      }

      const { row, col, value } = hint;
      const newState = currentState.map(r => [...r]);
      newState[row][col] = value;
      setCurrentState(newState);
      setHintsUsed(hintsUsed + 1);

      toast.info(`💡 Hint: Row ${row + 1}, Column ${col + 1} is ${value}`);
      checkCompletion(newState);
    } catch (error) {
      console.error('Error getting hint:', error);
      toast.error('Failed to get hint');
    }
  };

  const resetGame = () => {
    if (puzzle) {
      setCurrentState(puzzle.map(row => [...row]));
      setTimer(0);
      setHintsUsed(0);
      setGameCompleted(false);
      setSelectedCell(null);
      setSelectedNumber(null);
      toast.info('Game reset!');
    }
  };

  return (
    <div className="game-page">
      <div className="container">
        <div className="game-header">
          <h1>Sudoku Game</h1>
          
          {!gameStarted && !gameCompleted && (
            <div className="game-setup">
              <div className="difficulty-selector">
                <label>Select Difficulty:</label>
                <div className="difficulty-buttons">
                  <button
                    className={`btn ${difficulty === 'easy' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setDifficulty('easy')}
                  >
                    Easy
                  </button>
                  <button
                    className={`btn ${difficulty === 'medium' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setDifficulty('medium')}
                  >
                    Medium
                  </button>
                  <button
                    className={`btn ${difficulty === 'hard' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setDifficulty('hard')}
                  >
                    Hard
                  </button>
                  <button
                    className={`btn ${difficulty === 'expert' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setDifficulty('expert')}
                  >
                    Expert
                  </button>
                </div>
              </div>
              
              <button
                className="btn btn-success btn-large"
                onClick={startNewGame}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Start New Game'}
              </button>
            </div>
          )}
        </div>

        {gameStarted && currentState && (
          <>
            <div className="game-stats">
              <div className="stat-card">
                <div className="stat-label">Time</div>
                <div className="stat-value">⏱️ {formatTime(timer)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Difficulty</div>
                <div className="stat-value">
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Hints Used</div>
                <div className="stat-value">💡 {hintsUsed}/3</div>
              </div>
            </div>

            <SudokuBoard
              puzzle={puzzle}
              currentState={currentState}
              solution={solution}
              selectedCell={selectedCell}
              onCellClick={handleCellClick}
            />

            <NumberPad
              onNumberSelect={handleNumberSelect}
              selectedNumber={selectedNumber}
            />

            <div className="game-controls">
              <button className="btn btn-warning" onClick={getHint} disabled={hintsUsed >= 3}>
                💡 Get Hint ({3 - hintsUsed} left)
              </button>
              <button className="btn btn-secondary" onClick={resetGame}>
                🔄 Reset
              </button>
              <button className="btn btn-success" onClick={startNewGame}>
                🎮 New Game
              </button>
            </div>
          </>
        )}

        {gameCompleted && (
          <div className="game-completed">
            <h2>🎉 Congratulations!</h2>
            <p>You completed the puzzle!</p>
            <div className="completion-stats">
              <p>Time: {formatTime(timer)}</p>
              <p>Hints Used: {hintsUsed}</p>
            </div>
            <button className="btn btn-primary btn-large" onClick={startNewGame}>
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
