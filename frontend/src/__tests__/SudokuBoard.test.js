/**
 * Unit Tests for SudokuBoard Component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SudokuBoard from '../components/SudokuBoard';

describe('SudokuBoard Component', () => {
  const mockPuzzle = [
    ['5', '3', '-', '-', '7', '-', '-', '-', '-'],
    ['6', '-', '-', '1', '9', '5', '-', '-', '-'],
    ['-', '9', '8', '-', '-', '-', '-', '6', '-'],
    ['8', '-', '-', '-', '6', '-', '-', '-', '3'],
    ['4', '-', '-', '8', '-', '3', '-', '-', '1'],
    ['7', '-', '-', '-', '2', '-', '-', '-', '6'],
    ['-', '6', '-', '-', '-', '-', '2', '8', '-'],
    ['-', '-', '-', '4', '1', '9', '-', '-', '5'],
    ['-', '-', '-', '-', '8', '-', '-', '7', '9']
  ];

  const mockSolution = [
    ['5', '3', '4', '6', '7', '8', '9', '1', '2'],
    ['6', '7', '2', '1', '9', '5', '3', '4', '8'],
    ['1', '9', '8', '3', '4', '2', '5', '6', '7'],
    ['8', '5', '9', '7', '6', '1', '4', '2', '3'],
    ['4', '2', '6', '8', '5', '3', '7', '9', '1'],
    ['7', '1', '3', '9', '2', '4', '8', '5', '6'],
    ['9', '6', '1', '5', '3', '7', '2', '8', '4'],
    ['2', '8', '7', '4', '1', '9', '6', '3', '5'],
    ['3', '4', '5', '2', '8', '6', '1', '7', '9']
  ];

  const mockCurrentState = mockPuzzle.map(row => [...row]);
  const mockOnCellClick = jest.fn();
  const mockOnCellChange = jest.fn();

  const defaultProps = {
    puzzle: mockPuzzle,
    currentState: mockCurrentState,
    solution: mockSolution,
    selectedCell: null,
    onCellClick: mockOnCellClick,
    onCellChange: mockOnCellChange
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render 9x9 grid (81 cells)', () => {
      const { container } = render(<SudokuBoard {...defaultProps} />);
      const cells = container.querySelectorAll('. sudoku-cell');
      expect(cells).toHaveLength(81);
    });

    it('should display pre-filled numbers', () => {
      const { container } = render(<SudokuBoard {...defaultProps} />);
      
      // First cell should show 5
      const cells = container.querySelectorAll('. sudoku-cell');
      expect(cells[0]).toHaveTextContent('5');
    });

    it('should not display empty cells', () => {
      const { container } = render(<SudokuBoard {...defaultProps} />);
      
      // Third cell (index 2) should be empty (marked with '-')
      const cells = container.querySelectorAll('.sudoku-cell');
      expect(cells[2]).toHaveTextContent('');
    });

    it('should apply prefilled class to original puzzle cells', () => {
      const { container } = render(<SudokuBoard {...defaultProps} />);
      const prefilledCells = container.querySelectorAll('.cell-prefilled');
      
      // Count non-empty cells in puzzle (not '-' or '0')
      const nonEmptyCount = mockPuzzle.flat().filter(cell => cell !== '-' && cell !== '0').length;
      expect(prefilledCells.length).toBe(nonEmptyCount);
    });
  });

  describe('Cell Selection', () => {
    it('should call onCellClick when clicking empty cell', () => {
      const { container } = render(<SudokuBoard {...defaultProps} />);
      const cells = container.querySelectorAll('. sudoku-cell');
      
      // Click on empty cell (index 2, which is '-')
      fireEvent.click(cells[2]);
      
      expect(mockOnCellClick).toHaveBeenCalledWith(0, 2);
    });

    it('should not allow clicking pre-filled cells', () => {
      const { container } = render(<SudokuBoard {...defaultProps} />);
      const cells = container.querySelectorAll('.sudoku-cell');
      
      // Click on pre-filled cell (index 0, which is '5')
      fireEvent.click(cells[0]);
      
      expect(mockOnCellClick).not.toHaveBeenCalled();
    });

    it('should highlight selected cell', () => {
      const props = {
        ...defaultProps,
        selectedCell: { row: 0, col: 2 }
      };
      
      const { container } = render(<SudokuBoard {...props} />);
      const selectedCells = container.querySelectorAll('.cell-selected');
      
      expect(selectedCells).toHaveLength(1);
    });

    it('should highlight cells in same row, column, and box', () => {
      const props = {
        ...defaultProps,
        selectedCell: { row: 4, col: 4 } // Center cell
      };
      
      const { container } = render(<SudokuBoard {...props} />);
      const highlightedCells = container.querySelectorAll('.cell-highlighted');
      
      // Should highlight row (9) + column (9) + box (9) - overlaps
      expect(highlightedCells. length).toBeGreaterThan(0);
    });
  });

  describe('Cell Borders', () => {
    it('should add thick borders for 3x3 box separation', () => {
      const { container } = render(<SudokuBoard {...defaultProps} />);
      
      const bottomBorders = container.querySelectorAll('. border-bottom-thick');
      const rightBorders = container.querySelectorAll('.border-right-thick');
      
      // Should have thick borders after rows 2, 5 and cols 2, 5
      expect(bottomBorders. length).toBeGreaterThan(0);
      expect(rightBorders.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle all empty puzzle', () => {
      const emptyPuzzle = Array(9).fill(null).map(() => Array(9).fill('-'));
      const props = {
        ...defaultProps,
        puzzle: emptyPuzzle,
        currentState: emptyPuzzle
      };
      
      const { container } = render(<SudokuBoard {...props} />);
      const cells = container. querySelectorAll('.sudoku-cell');
      
      expect(cells).toHaveLength(81);
    });

    it('should handle fully filled puzzle', () => {
      const props = {
        ...defaultProps,
        puzzle: mockSolution,
        currentState: mockSolution
      };
      
      const { container } = render(<SudokuBoard {...props} />);
      const prefilledCells = container.querySelectorAll('.cell-prefilled');
      
      expect(prefilledCells).toHaveLength(81);
    });

    it('should handle cells with 0 as empty', () => {
      const puzzleWithZeros = mockPuzzle.map(row => 
        row.map(cell => cell === '-' ? '0' : cell)
      );
      
      const props = {
        ... defaultProps,
        puzzle: puzzleWithZeros,
        currentState: puzzleWithZeros
      };
      
      const { container } = render(<SudokuBoard {...props} />);
      const cells = container.querySelectorAll('.sudoku-cell');
      
      // Cell with '0' should be empty
      const emptyCell = Array. from(cells).find(cell => 
        cell.textContent === ''
      );
      expect(emptyCell).toBeInTheDocument();
    });
  });
});