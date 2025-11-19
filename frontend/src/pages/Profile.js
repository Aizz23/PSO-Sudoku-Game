import React, { useState, useEffect } from 'react';
import { gameAPI, authAPI } from '../services/api';
import './Profile.css';

const Profile = ({ user }) => {
  const [userStats, setUserStats] = useState(null);
  const [recentGames, setRecentGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [statsResponse, gamesResponse] = await Promise.all([
        authAPI.getUser(user.id),
        gameAPI.getUserGames(user.id),
      ]);

      setUserStats(statsResponse.data.data);
      setRecentGames(gamesResponse.data.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return 'N/A';
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <h1>Player Profile</h1>

        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-icon">👤</div>
          </div>
          <div className="profile-info">
            <h2>{userStats?.username}</h2>
            <p className="email">{userStats?.email}</p>
            <p className="joined">
              Member since {formatDate(userStats?.createdAt)}
            </p>
          </div>
        </div>

        <div className="stats-section">
          <h3>Statistics</h3>
          <div className="stats-grid-profile">
            <div className="stat-box">
              <div className="stat-icon">🎮</div>
              <div className="stat-value">{userStats?.gamesPlayed || 0}</div>
              <div className="stat-name">Games Played</div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">🏆</div>
              <div className="stat-value">{userStats?.gamesWon || 0}</div>
              <div className="stat-name">Games Won</div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">⭐</div>
              <div className="stat-value">{userStats?.totalScore || 0}</div>
              <div className="stat-name">Total Score</div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">⏱️</div>
              <div className="stat-value">{formatTime(userStats?.bestTime)}</div>
              <div className="stat-name">Best Time</div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">📊</div>
              <div className="stat-value">
                {userStats?.gamesPlayed > 0
                  ? `${((userStats?.gamesWon / userStats?.gamesPlayed) * 100).toFixed(1)}%`
                  : '0%'}
              </div>
              <div className="stat-name">Win Rate</div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">🎯</div>
              <div className="stat-value">
                {userStats?.gamesPlayed > 0
                  ? Math.round(userStats?.totalScore / userStats?.gamesPlayed)
                  : 0}
              </div>
              <div className="stat-name">Avg. Score</div>
            </div>
          </div>
        </div>

        <div className="recent-games-section">
          <h3>Recent Games</h3>
          {recentGames.length === 0 ? (
            <p className="no-games">No games played yet. Start playing to see your history!</p>
          ) : (
            <div className="games-table-container">
              <table className="games-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Difficulty</th>
                    <th>Status</th>
                    <th>Time</th>
                    <th>Mistakes</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {recentGames.map((game) => (
                    <tr key={game._id}>
                      <td>{formatDate(game.createdAt)}</td>
                      <td>
                        <span className={`badge badge-${game.difficulty}`}>
                          {game.difficulty}
                        </span>
                      </td>
                      <td>
                        <span className={`status status-${game.status}`}>
                          {game.status === 'completed' && '✅ Completed'}
                          {game.status === 'in-progress' && '⏳ In Progress'}
                          {game.status === 'abandoned' && '❌ Abandoned'}
                        </span>
                      </td>
                      <td>{formatTime(game.timeElapsed)}</td>
                      <td>{game.mistakes}</td>
                      <td className="score-cell">{game.score || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
