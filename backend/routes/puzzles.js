const express = require('express');
const router = express.Router();
const sudokuGenerator = require('../utils/sudokuGenerator');

/**
 * @route   GET /api/puzzles/generate
 * @desc    Generate a new Sudoku puzzle
 * @access  Public
 */
router.get('/generate', async (req, res) => {
  try {
    const { difficulty = 'medium' } = req.query;

    if (!['easy', 'medium', 'hard', 'expert'].includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid difficulty level. Choose: easy, medium, hard, or expert',
      });
    }

    const puzzleData = sudokuGenerator.generatePuzzle(difficulty);

    res.status(200).json({
      success: true,
      data: puzzleData,
    });
  } catch (error) {
    console.error('Error generating puzzle:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating puzzle',
    });
  }
});

/**
 * @route   POST /api/puzzles/validate
 * @desc    Validate a Sudoku solution
 * @access  Public
 */
router.post('/validate', async (req, res) => {
  try {
    const { board } = req.body;

    if (!board || !Array.isArray(board) || board.length !== 9) {
      return res.status(400).json({
        success: false,
        message: 'Invalid board format',
      });
    }

    const numBoard = sudokuGenerator.stringToBoard(board);
    const isValid = sudokuGenerator.validateBoard(numBoard);

    res.status(200).json({
      success: true,
      data: {
        isValid,
      },
    });
  } catch (error) {
    console.error('Error validating puzzle:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating puzzle',
    });
  }
});

/**
 * @route   POST /api/puzzles/solve
 * @desc    Solve a Sudoku puzzle
 * @access  Public
 */
router.post('/solve', async (req, res) => {
  try {
    const { board } = req.body;

    if (!board || !Array.isArray(board) || board.length !== 9) {
      return res.status(400).json({
        success: false,
        message: 'Invalid board format',
      });
    }

    const numBoard = sudokuGenerator.stringToBoard(board);
    const solution = sudokuGenerator.solve(numBoard);

    if (!solution) {
      return res.status(400).json({
        success: false,
        message: 'Puzzle cannot be solved',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        solution: sudokuGenerator.boardToString(solution),
      },
    });
  } catch (error) {
    console.error('Error solving puzzle:', error);
    res.status(500).json({
      success: false,
      message: 'Error solving puzzle',
    });
  }
});

/**
 * @route   POST /api/puzzles/hint
 * @desc    Get a hint for the puzzle
 * @access  Public
 */
router.post('/hint', async (req, res) => {
  try {
    const { puzzle, solution } = req.body;

    if (!puzzle || !solution) {
      return res.status(400).json({
        success: false,
        message: 'Puzzle and solution are required',
      });
    }

    const hint = sudokuGenerator.getHint(puzzle, solution);

    if (!hint) {
      return res.status(200).json({
        success: true,
        message: 'Puzzle is already complete',
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: hint,
    });
  } catch (error) {
    console.error('Error getting hint:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting hint',
    });
  }
});

module.exports = router;
