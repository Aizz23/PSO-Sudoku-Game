const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const User = require('../models/User');

/**
 * @route   POST /api/games
 * @desc    Create a new game
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { puzzle, solution, difficulty, userId, username } = req.body;

    if (!puzzle || !solution || !difficulty) {
      return res.status(400).json({
        success: false,
        message: 'Puzzle, solution, and difficulty are required',
      });
    }

    const game = await Game.create({
      user: userId || null,
      username: username || 'Guest',
      puzzle,
      solution,
      currentState: puzzle,
      difficulty,
      status: 'in-progress',
    });

    res.status(201).json({
      success: true,
      data: game,
    });
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating game',
    });
  }
});

/**
 * @route   GET /api/games/:id
 * @desc    Get a game by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id).populate(
      'user',
      'username'
    );

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }

    res.status(200).json({
      success: true,
      data: game,
    });
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching game',
    });
  }
});

/**
 * @route   PUT /api/games/:id
 * @desc    Update game state
 * @access  Public
 */
router.put('/:id', async (req, res) => {
  try {
    const { currentState, status, timeElapsed, hintsUsed } = req.body;

    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }

    if (currentState) game.currentState = currentState;
    if (status) {
      game.status = status;
      if (status === 'completed') {
        game.endTime = new Date();
      }
    }
    if (timeElapsed !== undefined) game.timeElapsed = timeElapsed;
    if (hintsUsed !== undefined) game.hintsUsed = hintsUsed;

    await game.save();

    res.status(200).json({
      success: true,
      data: game,
    });
  } catch (error) {
    console.error('Error updating game:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating game',
    });
  }
});

/**
 * @route   GET /api/games/user/:userId
 * @desc    Get all games for a user
 * @access  Public
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const games = await Game.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: games.length,
      data: games,
    });
  } catch (error) {
    console.error('Error fetching user games:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user games',
    });
  }
});

/**
 * @route   DELETE /api/games/:id
 * @desc    Delete a game
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }

    await game.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Game deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting game',
    });
  }
});

module.exports = router;
