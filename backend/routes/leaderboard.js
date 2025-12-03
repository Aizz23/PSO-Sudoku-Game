const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const User = require('../models/User');

/**
 * @route   GET /api/leaderboard/top-scores
 * @desc    Get top scores across all difficulties
 * @access  Public
 */
router.get('/top-scores', async (req, res) => {
  try {
    const { difficulty, limit = 10 } = req.query;

    const query = { status: 'completed' };
    if (difficulty) {
      query.difficulty = difficulty;
    }

    const topGames = await Game.find(query)
      .sort({ score: -1, timeElapsed: 1 })
      .limit(parseInt(limit))
      .populate('user', 'username')
      .select('username score timeElapsed difficulty createdAt');

    res.status(200).json({
      success: true,
      count: topGames.length,
      data: topGames,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
    });
  }
});

/**
 * @route   GET /api/leaderboard/fastest-times
 * @desc    Get fastest completion times
 * @access  Public
 */
router.get('/fastest-times', async (req, res) => {
  try {
    const { difficulty, limit = 10 } = req.query;

    const query = { status: 'completed' };
    if (difficulty) {
      query.difficulty = difficulty;
    }

    const fastestGames = await Game.find(query)
      .sort({ timeElapsed: 1 })
      .limit(parseInt(limit))
      .populate('user', 'username')
      .select('username score timeElapsed difficulty createdAt');

    res.status(200).json({
      success: true,
      count: fastestGames.length,
      data: fastestGames,
    });
  } catch (error) {
    console.error('Error fetching fastest times:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching fastest times',
    });
  }
});

/**
 * @route   GET /api/leaderboard/top-players
 * @desc    Get top players by total score
 * @access  Public
 */
router.get('/top-players', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topPlayers = await User.find()
      .sort({ totalScore: -1, gamesWon: -1 })
      .limit(parseInt(limit))
      .select('username totalScore gamesPlayed gamesWon bestTime createdAt');

    res.status(200).json({
      success: true,
      count: topPlayers.length,
      data: topPlayers,
    });
  } catch (error) {
    console.error('Error fetching top players:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top players',
    });
  }
});

/**
 * @route   GET /api/leaderboard/stats
 * @desc    Get overall game statistics
 * @access  Public
 */
router.get('/stats', async (req, res) => {
  try {
    const totalGames = await Game.countDocuments();
    const completedGames = await Game.countDocuments({ status: 'completed' });
    const totalUsers = await User.countDocuments();

    const avgTimeResult = await Game.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, avgTime: { $avg: '$timeElapsed' } } },
    ]);

    const gamesByDifficulty = await Game.aggregate([
      { $group: { _id: '$difficulty', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalGames,
        completedGames,
        totalUsers,
        averageCompletionTime: avgTimeResult[0]?.avgTime || 0,
        gamesByDifficulty,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
    });
  }
});

module.exports = router;
