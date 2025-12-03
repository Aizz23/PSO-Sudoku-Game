/**
 * Unit Tests for SudokuBoard Component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SudokuBoard from '../components/SudokuBoard';

describe('SudokuBoard Component', () => {
  const mockPuzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ];

  const mockSolution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
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
      const cells = container.querySelectorAll('.sudoku-cell');
      expect(cells).toHaveLength(81);
    });

    it('should display pre-filled numbers', () => {
      render(<SudokuBoard {...defaultProps} />);
      
      // First cell should show 5
      const cells = screen.getAllByRole('button');
      expect(cells[0]).toHaveTextContent('5');
    });

    it('should not display empty cells', () => {
      render(<SudokuBoard {...defaultProps} />);
      
      // Third cell (index 2) should be empty
      const cells = screen.getAllByRole('button');
      expect(cells[2]).toHaveTextContent('');
    });

    it('should apply prefilled class to original puzzle cells', () => {
      const { container } = render(<SudokuBoard {...defaultProps} />);
      const prefilledCells = container.querySelectorAll('.cell-prefilled');
      
      // Count non-zero cells in puzzle
      const nonZeroCount = mockPuzzle.flat().filter(cell => cell !== 0).length;
      expect(prefilledCells.length).toBe(nonZeroCount);
    });
  });

  describe('Cell Selection', () => {
    it('should call onCellClick when clicking empty cell', () => {
      render(<SudokuBoard {...defaultProps} />);
      const cells = screen.getAllByRole('button');
      
      // Click on empty cell (index 2, which is 0)
      fireEvent.click(cells[2]);
      
      expect(mockOnCellClick).toHaveBeenCalledWith(0, 2);
    });

    it('should not allow clicking pre-filled cells', () => {
      render(<SudokuBoard {...defaultProps} />);
      const cells = screen.getAllByRole('button');
      
      // Click on pre-filled cell (index 0, which is 5)
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
      expect(highlightedCells.length).toBeGreaterThan(0);
    });
  });

  describe('Cell Borders', () => {
    it('should add thick borders for 3x3 box separation', () => {
      const { container } = render(<SudokuBoard {...defaultProps} />);
      
      const bottomBorders = container.querySelectorAll('.border-bottom-thick');
      const rightBorders = container.querySelectorAll('.border-right-thick');
      
      // Should have thick borders after rows 2, 5 and cols 2, 5
      expect(bottomBorders.length).toBeGreaterThan(0);
      expect(rightBorders.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA roles', () => {
      render(<SudokuBoard {...defaultProps} />);
      const cells = screen.getAllByRole('button');
      expect(cells.length).toBe(81);
    });

    it('should be keyboard accessible', () => {
      render(<SudokuBoard {...defaultProps} />);
      const cells = screen.getAllByRole('button');
      
      // Empty cell should be focusable
      expect(cells[2]).not.toHaveAttribute('disabled');
    });
  });

  describe('Edge Cases', () => {
    it('should handle all empty puzzle', () => {
      const emptyPuzzle = Array(9).fill(null).map(() => Array(9).fill(0));
      const props = {
        ...defaultProps,
        puzzle: emptyPuzzle,
        currentState: emptyPuzzle
      };
      
      const { container } = render(<SudokuBoard {...props} />);
      const cells = container.querySelectorAll('.sudoku-cell');
      
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
  });
});
