const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

/**
 * @route   GET /api/leaderboard/top-scores
 * @desc    Get top scores (sorted by score)
 * @access  Public
 */
router.get('/top-scores', async (req, res) => {
  try {
    const { difficulty = '', limit = 10 } = req.query;

    // Build filter for completed games
    const filter = { status: 'completed' };
    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }

    const scores = await Game.find(filter)
      .select('username score difficulty timeElapsed hintsUsed createdAt')
      .sort({ score: -1 })
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      data: scores,
      count: scores.length,
    });
  } catch (error) {
    console.error('Error fetching top scores:', error);
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
    const { difficulty = '', limit = 10 } = req.query;

    const filter = { status: 'completed' };
    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }

    const fastestTimes = await Game.find(filter)
      .select('username timeElapsed difficulty score createdAt')
      .sort({ timeElapsed: 1 })
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      data: fastestTimes,
      count: fastestTimes.length,
    });
  } catch (error) {
    console.error('Error fetching fastest times:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
    });
  }
});

/**
 * @route   GET /api/leaderboard/top-players
 * @desc    Get top players by total games completed
 * @access  Public
 */
router.get('/top-players', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topPlayers = await Game.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$username',
          totalGames: { $sum: 1 },
          totalScore: { $sum: '$score' },
          averageScore: { $avg: '$score' },
          bestScore: { $max: '$score' },
        },
      },
      { $sort: { totalScore: -1 } },
      { $limit: parseInt(limit) },
    ]);

    res.status(200).json({
      success: true,
      data: topPlayers,
      count: topPlayers.length,
    });
  } catch (error) {
    console.error('Error fetching top players:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
    });
  }
});

/**
 * @route   GET /api/leaderboard/stats
 * @desc    Get overall leaderboard statistics
 * @access  Public
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await Game.aggregate([
      {
        $group: {
          _id: null,
          totalGames: { $sum: 1 },
          completedGames: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          averageScore: { $avg: '$score' },
          highestScore: { $max: '$score' },
          averageTime: { $avg: '$timeElapsed' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || {},
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
