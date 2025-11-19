import React, { useState, useEffect } from 'react';
import { leaderboardAPI } from '../services/api';
import './Leaderboard.css';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('topScores');
  const [difficulty, setDifficulty] = useState('');
  const [topScores, setTopScores] = useState([]);
  const [fastestTimes, setFastestTimes] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab, difficulty]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'topScores') {
        const response = await leaderboardAPI.getTopScores(difficulty, 20);
        setTopScores(response.data.data);
      } else if (activeTab === 'fastestTimes') {
        const response = await leaderboardAPI.getFastestTimes(difficulty, 20);
        setFastestTimes(response.data.data);
      } else if (activeTab === 'topPlayers') {
        const response = await leaderboardAPI.getTopPlayers(20);
        setTopPlayers(response.data.data);
      } else if (activeTab === 'stats') {
        const response = await leaderboardAPI.getStats();
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="leaderboard-page">
      <div className="container">
        <h1>Leaderboard 🏆</h1>

        <div className="leaderboard-tabs">
          <button
            className={`tab-button ${activeTab === 'topScores' ? 'active' : ''}`}
            onClick={() => setActiveTab('topScores')}
          >
            Top Scores
          </button>
          <button
            className={`tab-button ${activeTab === 'fastestTimes' ? 'active' : ''}`}
            onClick={() => setActiveTab('fastestTimes')}
          >
            Fastest Times
          </button>
          <button
            className={`tab-button ${activeTab === 'topPlayers' ? 'active' : ''}`}
            onClick={() => setActiveTab('topPlayers')}
          >
            Top Players
          </button>
          <button
            className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
        </div>

        {(activeTab === 'topScores' || activeTab === 'fastestTimes') && (
          <div className="difficulty-filter">
            <button
              className={`filter-btn ${difficulty === '' ? 'active' : ''}`}
              onClick={() => setDifficulty('')}
            >
              All
            </button>
            <button
              className={`filter-btn ${difficulty === 'easy' ? 'active' : ''}`}
              onClick={() => setDifficulty('easy')}
            >
              Easy
            </button>
            <button
              className={`filter-btn ${difficulty === 'medium' ? 'active' : ''}`}
              onClick={() => setDifficulty('medium')}
            >
              Medium
            </button>
            <button
              className={`filter-btn ${difficulty === 'hard' ? 'active' : ''}`}
              onClick={() => setDifficulty('hard')}
            >
              Hard
            </button>
            <button
              className={`filter-btn ${difficulty === 'expert' ? 'active' : ''}`}
              onClick={() => setDifficulty('expert')}
            >
              Expert
            </button>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="leaderboard-content">
            {activeTab === 'topScores' && (
              <div className="leaderboard-table-container">
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Player</th>
                      <th>Score</th>
                      <th>Time</th>
                      <th>Difficulty</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topScores.map((game, index) => (
                      <tr key={game._id}>
                        <td className="rank">
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && index + 1}
                        </td>
                        <td>{game.username}</td>
                        <td className="score">{game.score}</td>
                        <td>{formatTime(game.timeElapsed)}</td>
                        <td>
                          <span className={`badge badge-${game.difficulty}`}>
                            {game.difficulty}
                          </span>
                        </td>
                        <td>{formatDate(game.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'fastestTimes' && (
              <div className="leaderboard-table-container">
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Player</th>
                      <th>Time</th>
                      <th>Score</th>
                      <th>Difficulty</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fastestTimes.map((game, index) => (
                      <tr key={game._id}>
                        <td className="rank">
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && index + 1}
                        </td>
                        <td>{game.username}</td>
                        <td className="time">⏱️ {formatTime(game.timeElapsed)}</td>
                        <td>{game.score}</td>
                        <td>
                          <span className={`badge badge-${game.difficulty}`}>
                            {game.difficulty}
                          </span>
                        </td>
                        <td>{formatDate(game.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'topPlayers' && (
              <div className="leaderboard-table-container">
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Player</th>
                      <th>Total Score</th>
                      <th>Games Played</th>
                      <th>Win Rate</th>
                      <th>Best Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPlayers.map((player, index) => (
                      <tr key={player._id}>
                        <td className="rank">
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && index + 1}
                        </td>
                        <td>{player.username}</td>
                        <td className="score">{player.totalScore}</td>
                        <td>{player.gamesPlayed}</td>
                        <td>
                          {player.gamesPlayed > 0
                            ? `${((player.gamesWon / player.gamesPlayed) * 100).toFixed(1)}%`
                            : 'N/A'}
                        </td>
                        <td>
                          {player.bestTime ? formatTime(player.bestTime) : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'stats' && stats && (
              <div className="stats-grid">
                <div className="stat-card-large">
                  <div className="stat-icon">🎮</div>
                  <div className="stat-number">{stats.totalGames}</div>
                  <div className="stat-label">Total Games</div>
                </div>
                <div className="stat-card-large">
                  <div className="stat-icon">✅</div>
                  <div className="stat-number">{stats.completedGames}</div>
                  <div className="stat-label">Completed Games</div>
                </div>
                <div className="stat-card-large">
                  <div className="stat-icon">👥</div>
                  <div className="stat-number">{stats.totalUsers}</div>
                  <div className="stat-label">Total Players</div>
                </div>
                <div className="stat-card-large">
                  <div className="stat-icon">⏱️</div>
                  <div className="stat-number">
                    {formatTime(Math.round(stats.averageCompletionTime))}
                  </div>
                  <div className="stat-label">Avg. Completion Time</div>
                </div>

                <div className="difficulty-stats">
                  <h3>Games by Difficulty</h3>
                  {stats.gamesByDifficulty.map((item) => (
                    <div key={item._id} className="difficulty-stat-item">
                      <span className={`badge badge-${item._id}`}>{item._id}</span>
                      <span className="count">{item.count} games</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
