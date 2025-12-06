/**
 * Unit Tests for Sudoku Generator
 * Tests the core logic of puzzle generation and validation
 */

const generator = require('../utils/sudokuGenerator');

describe('SudokuGenerator - Unit Tests', () => {
  describe('generateSolution()', () => {
    it('should generate a valid 9x9 board', () => {
      const solution = generator.generateSolution();

      expect(solution).toHaveLength(9);
      solution.forEach((row) => {
        expect(row).toHaveLength(9);
      });
    });

    it('should contain only numbers 1-9', () => {
      const solution = generator.generateSolution();

      solution.forEach((row) => {
        row.forEach((cell) => {
          expect(cell).toBeGreaterThanOrEqual(1);
          expect(cell).toBeLessThanOrEqual(9);
        });
      });
    });

    it('should have unique numbers in each row', () => {
      const solution = generator.generateSolution();

      solution.forEach((row) => {
        const uniqueNumbers = new Set(row);
        expect(uniqueNumbers.size).toBe(9);
      });
    });

    it('should have unique numbers in each column', () => {
      const solution = generator.generateSolution();

      for (let col = 0; col < 9; col++) {
        const column = solution.map((row) => row[col]);
        const uniqueNumbers = new Set(column);
        expect(uniqueNumbers.size).toBe(9);
      }
    });

    it('should have unique numbers in each 3x3 box', () => {
      const solution = generator.generateSolution();

      for (let boxRow = 0; boxRow < 3; boxRow++) {
        for (let boxCol = 0; boxCol < 3; boxCol++) {
          const box = [];
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              box.push(solution[boxRow * 3 + i][boxCol * 3 + j]);
            }
          }
          const uniqueNumbers = new Set(box);
          expect(uniqueNumbers.size).toBe(9);
        }
      }
    });
  });

  describe('isValid()', () => {
    it('should return true for valid placement', () => {
      const board = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      expect(generator.isValid(board, 0, 0, 5)).toBe(true);
    });

    it('should return false for duplicate in row', () => {
      const board = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      board[0][5] = 7;
      expect(generator.isValid(board, 0, 0, 7)).toBe(false);
    });

    it('should return false for duplicate in column', () => {
      const board = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      board[5][0] = 7;
      expect(generator.isValid(board, 0, 0, 7)).toBe(false);
    });

    it('should return false for duplicate in 3x3 box', () => {
      const board = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      board[1][1] = 7;
      expect(generator.isValid(board, 0, 0, 7)).toBe(false);
    });
  });

  describe('generatePuzzle()', () => {
    it('should generate puzzle with correct difficulty - easy', () => {
      const result = generator.generatePuzzle('easy');

      expect(result).toHaveProperty('puzzle');
      expect(result).toHaveProperty('solution');
      expect(result).toHaveProperty('difficulty');
      expect(result.difficulty).toBe('easy');
    });

    it('should generate puzzle with correct difficulty - medium', () => {
      const result = generator.generatePuzzle('medium');
      expect(result.difficulty).toBe('medium');
    });

    it('should generate puzzle with correct difficulty - hard', () => {
      const result = generator.generatePuzzle('hard');
      expect(result.difficulty).toBe('hard');
    });

    it('should remove appropriate number of cells for easy', () => {
      const result = generator.generatePuzzle('easy');
      // Puzzle is in string format, count "-" for empty cells
      const emptyCount = result.puzzle
        .flat()
        .filter((cell) => cell === '-').length;

      // Easy should have 30-40 empty cells
      expect(emptyCount).toBeGreaterThanOrEqual(30);
      expect(emptyCount).toBeLessThanOrEqual(40);
    });

    it('should remove more cells for hard difficulty', () => {
      const result = generator.generatePuzzle('hard');
      // Count "-" for empty cells in string format
      const emptyCount = result.puzzle
        .flat()
        .filter((cell) => cell === '-').length;

      // Hard should have 50+ empty cells
      expect(emptyCount).toBeGreaterThanOrEqual(50);
    });

    it('should have matching solution', () => {
      const result = generator.generatePuzzle('medium');

      // Every filled cell in puzzle should match solution (both are strings)
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (result.puzzle[row][col] !== '-') {
            expect(result.puzzle[row][col]).toBe(result.solution[row][col]);
          }
        }
      }
    });
  });

  describe('Validation', () => {
    it('should generate valid complete solutions', () => {
      const solution = generator.generateSolution();

      // Test that solution is valid by checking no duplicates
      // Check rows
      for (let row = 0; row < 9; row++) {
        const uniqueInRow = new Set(solution[row]);
        expect(uniqueInRow.size).toBe(9);
      }

      // Check columns
      for (let col = 0; col < 9; col++) {
        const column = solution.map((row) => row[col]);
        const uniqueInCol = new Set(column);
        expect(uniqueInCol.size).toBe(9);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple puzzle generations', () => {
      const puzzles = [];
      for (let i = 0; i < 5; i++) {
        puzzles.push(generator.generatePuzzle('medium'));
      }

      // All should be valid
      puzzles.forEach((puzzle) => {
        expect(puzzle).toHaveProperty('puzzle');
        expect(puzzle).toHaveProperty('solution');
      });

      // Should generate different puzzles (low collision probability)
      const serialized = puzzles.map((p) => JSON.stringify(p.puzzle));
      const unique = new Set(serialized);
      expect(unique.size).toBeGreaterThan(1);
    });

    it('should handle invalid difficulty gracefully', () => {
      // Should default to medium or handle gracefully
      const result = generator.generatePuzzle('invalid');
      expect(result).toHaveProperty('puzzle');
    });
  });

  describe('Performance Tests', () => {
    it('should generate puzzle in reasonable time', () => {
      const start = Date.now();
      generator.generatePuzzle('medium');
      const duration = Date.now() - start;

      // Should complete in under 5 seconds
      expect(duration).toBeLessThan(5000);
    });
  });
});
