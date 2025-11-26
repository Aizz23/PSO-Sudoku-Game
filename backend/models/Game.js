const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow guest users
  },
  username: {
    type: String,
    default: 'Guest'
  },
  puzzle: {
    type: [[String]],
    required: true
  },
  solution: {
    type: [[String]],
    required: true
  },
  currentState: {
    type: [[String]],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    required: true
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  timeElapsed: {
    type: Number, // in seconds
    default: 0
  },
  hintsUsed: {
    type: Number,
    default: 0
  },
  score: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate score before saving
GameSchema.pre('save', function(next) {
  if (this.status === 'completed') {
    // Score formula: base points - time penalty - hint penalty
    const basePoints = 1000;
    const timePenalty = Math.floor(this.timeElapsed / 10);
    const hintPenalty = this.hintsUsed * 20;
    
    this.score = Math.max(0, basePoints - timePenalty - hintPenalty);
  }
  next();
});

module.exports = mongoose.model('Game', GameSchema);
