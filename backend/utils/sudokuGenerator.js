/**
 * Sudoku Puzzle Generator with Multiple Difficulty Levels
 */

class SudokuGenerator {
  constructor() {
    this.SIZE = 9;
    this.BOX_SIZE = 3;
  }

  /**
   * Generate a complete valid Sudoku solution
   */
  generateSolution() {
    const board = Array(this.SIZE).fill(null).map(() => Array(this.SIZE).fill(0));
    this.fillBoard(board);
    return board;
  }

  /**
   * Fill the board using backtracking
   */
  fillBoard(board) {
    const numbers = this.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    
    for (let row = 0; row < this.SIZE; row++) {
      for (let col = 0; col < this.SIZE; col++) {
        if (board[row][col] === 0) {
          for (let num of numbers) {
            if (this.isValid(board, row, col, num)) {
              board[row][col] = num;
              
              if (this.fillBoard(board)) {
                return true;
              }
              
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Check if placing a number is valid
   */
  isValid(board, row, col, num) {
    // Check row
    for (let x = 0; x < this.SIZE; x++) {
      if (board[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < this.SIZE; x++) {
      if (board[x][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / this.BOX_SIZE) * this.BOX_SIZE;
    const boxCol = Math.floor(col / this.BOX_SIZE) * this.BOX_SIZE;
    
    for (let i = 0; i < this.BOX_SIZE; i++) {
      for (let j = 0; j < this.BOX_SIZE; j++) {
        if (board[boxRow + i][boxCol + j] === num) return false;
      }
    }

    return true;
  }

  /**
   * Generate a puzzle by removing numbers from solution
   */
  generatePuzzle(difficulty = 'medium') {
    const solution = this.generateSolution();
    const puzzle = solution.map(row => [...row]);
    
    const cellsToRemove = this.getCellsToRemove(difficulty);
    let removed = 0;
    const attempts = cellsToRemove * 3; // Maximum attempts
    
    for (let i = 0; i < attempts && removed < cellsToRemove; i++) {
      const row = Math.floor(Math.random() * this.SIZE);
      const col = Math.floor(Math.random() * this.SIZE);
      
      if (puzzle[row][col] !== 0) {
        const backup = puzzle[row][col];
        puzzle[row][col] = 0;
        
        // Ensure puzzle still has unique solution
        if (this.hasUniqueSolution(puzzle)) {
          removed++;
        } else {
          puzzle[row][col] = backup;
        }
      }
    }

    return {
      puzzle: this.boardToString(puzzle),
      solution: this.boardToString(solution),
      difficulty
    };
  }

  /**
   * Determine how many cells to remove based on difficulty
   */
  getCellsToRemove(difficulty) {
    const levels = {
      easy: 30,     // Remove 30 cells
      medium: 40,   // Remove 40 cells
      hard: 50,     // Remove 50 cells
      expert: 55    // Remove 55 cells
    };
    return levels[difficulty] || levels.medium;
  }

  /**
   * Check if puzzle has unique solution
   */
  hasUniqueSolution(board) {
    const solutions = [];
    this.countSolutions(board, solutions, 2); // Stop after finding 2 solutions
    return solutions.length === 1;
  }

  /**
   * Count solutions using backtracking
   */
  countSolutions(board, solutions, limit) {
    if (solutions.length >= limit) return;

    for (let row = 0; row < this.SIZE; row++) {
      for (let col = 0; col < this.SIZE; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (this.isValid(board, row, col, num)) {
              board[row][col] = num;
              this.countSolutions(board, solutions, limit);
              board[row][col] = 0;
            }
          }
          return;
        }
      }
    }
    
    // Found a complete solution
    solutions.push(board.map(row => [...row]));
  }

  /**
   * Solve a Sudoku puzzle
   */
  solve(board) {
    const copy = board.map(row => [...row]);
    if (this.fillBoard(copy)) {
      return copy;
    }
    return null;
  }

  /**
   * Convert board to string array format
   */
  boardToString(board) {
    return board.map(row => row.map(cell => cell === 0 ? '-' : cell.toString()));
  }

  /**
   * Convert string array to board
   */
  stringToBoard(stringBoard) {
    return stringBoard.map(row => 
      row.map(cell => cell === '-' ? 0 : parseInt(cell))
    );
  }

  /**
   * Shuffle array
   */
  shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Validate a completed board
   */
  validateBoard(board) {
    for (let row = 0; row < this.SIZE; row++) {
      for (let col = 0; col < this.SIZE; col++) {
        const num = board[row][col];
        if (num === 0) return false;
        
        board[row][col] = 0;
        if (!this.isValid(board, row, col, num)) {
          board[row][col] = num;
          return false;
        }
        board[row][col] = num;
      }
    }
    return true;
  }

  /**
   * Get a hint (random empty cell with correct value)
   */
  getHint(puzzle, solution) {
    const emptyCells = [];
    
    for (let row = 0; row < this.SIZE; row++) {
      for (let col = 0; col < this.SIZE; col++) {
        if (puzzle[row][col] === '-' || puzzle[row][col] === '0') {
          emptyCells.push({ row, col, value: solution[row][col] });
        }
      }
    }
    
    if (emptyCells.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  }
}

module.exports = new SudokuGenerator();
