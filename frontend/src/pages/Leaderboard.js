import React, { useState, useEffect, useCallback } from 'react';
import { leaderboardAPI } from '../services/api';
import './Leaderboard.css';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('scores');
  const [difficulty, setDifficulty] = useState('All');
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch data based on active tab
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      if (activeTab === 'scores') {
        const response = await leaderboardAPI.getTopScores(difficulty, 10);
        setData(response.data.data);
      } else if (activeTab === 'times') {
        const response = await leaderboardAPI.getFastestTimes(difficulty, 10);
        setData(response.data.data);
      } else if (activeTab === 'players') {
        const response = await leaderboardAPI.getTopPlayers(10);
        setData(response.data.data);
      }

      // Always fetch stats
      const statsResponse = await leaderboardAPI.getStats();
      setStats(statsResponse.data.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, difficulty]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">🏆 Leaderboard</h1>

      {/* Stats Summary */}
      {stats && (
        <div className="stats-summary">
          <div className="stat-card">
            <div className="stat-value">{stats.totalGames || 0}</div>
            <div className="stat-label">Total Games</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.completedGames || 0}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.highestScore || 0}</div>
            <div className="stat-label">Highest Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{Math.round(stats.averageScore || 0)}</div>
            <div className="stat-label">Avg Score</div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="leaderboard-tabs">
        <button
          className={`tab-button ${activeTab === 'scores' ? 'active' : ''}`}
          onClick={() => setActiveTab('scores')}
        >
          Top Scores
        </button>
        <button
          className={`tab-button ${activeTab === 'times' ? 'active' : ''}`}
          onClick={() => setActiveTab('times')}
        >
          Fastest Times
        </button>
        <button
          className={`tab-button ${activeTab === 'players' ? 'active' : ''}`}
          onClick={() => setActiveTab('players')}
        >
          Top Players
        </button>
      </div>

      {/* Difficulty Filter (only for scores and times) */}
      {(activeTab === 'scores' || activeTab === 'times') && (
        <div className="difficulty-filter">
          {['All', 'easy', 'medium', 'hard', 'expert'].map((diff) => (
            <button
              key={diff}
              className={`difficulty-btn ${difficulty === diff ? 'active' : ''}`}
              onClick={() => setDifficulty(diff)}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="leaderboard-table-wrapper">
        {loading ? (
          <p className="loading">Loading...</p>
        ) : data.length === 0 ? (
          <p className="no-data">No data available</p>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                {activeTab === 'scores' && (
                  <>
                    <th>Player</th>
                    <th>Score</th>
                    <th>Time</th>
                    <th>Difficulty</th>
                    <th>Date</th>
                  </>
                )}
                {activeTab === 'times' && (
                  <>
                    <th>Player</th>
                    <th>Time</th>
                    <th>Score</th>
                    <th>Difficulty</th>
                    <th>Date</th>
                  </>
                )}
                {activeTab === 'players' && (
                  <>
                    <th>Player</th>
                    <th>Games</th>
                    <th>Total Score</th>
                    <th>Avg Score</th>
                    <th>Best Score</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="rank">#{index + 1}</td>
                  {activeTab === 'scores' && (
                    <>
                      <td>{item.username}</td>
                      <td className="score">{item.score}</td>
                      <td>{formatTime(item.timeElapsed)}</td>
                      <td>
                        <span className={`difficulty-badge ${item.difficulty}`}>
                          {item.difficulty}
                        </span>
                      </td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    </>
                  )}
                  {activeTab === 'times' && (
                    <>
                      <td>{item.username}</td>
                      <td className="time">{formatTime(item.timeElapsed)}</td>
                      <td className="score">{item.score}</td>
                      <td>
                        <span className={`difficulty-badge ${item.difficulty}`}>
                          {item.difficulty}
                        </span>
                      </td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    </>
                  )}
                  {activeTab === 'players' && (
                    <>
                      <td>{item._id}</td>
                      <td>{item.totalGames}</td>
                      <td className="score">{item.totalScore}</td>
                      <td>{Math.round(item.averageScore)}</td>
                      <td className="score">{item.bestScore}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
