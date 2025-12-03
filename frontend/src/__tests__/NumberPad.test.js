/**
 * Unit Tests for NumberPad Component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NumberPad from '../components/NumberPad';

describe('NumberPad Component', () => {
  const mockOnNumberClick = jest.fn();
  const mockOnEraseClick = jest.fn();
  const mockOnHintClick = jest.fn();

  const defaultProps = {
    onNumberClick: mockOnNumberClick,
    onEraseClick: mockOnEraseClick,
    onHintClick: mockOnHintClick,
    hintsRemaining: 3
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render numbers 1-9', () => {
      render(<NumberPad {...defaultProps} />);
      
      for (let i = 1; i <= 9; i++) {
        expect(screen.getByText(i.toString())).toBeInTheDocument();
      }
    });

    it('should render erase button', () => {
      render(<NumberPad {...defaultProps} />);
      expect(screen.getByText(/erase/i)).toBeInTheDocument();
    });

    it('should render hint button', () => {
      render(<NumberPad {...defaultProps} />);
      expect(screen.getByText(/hint/i)).toBeInTheDocument();
    });

    it('should display hints remaining count', () => {
      render(<NumberPad {...defaultProps} />);
      expect(screen.getByText(/3/)).toBeInTheDocument();
    });
  });

  describe('Number Button Interactions', () => {
    it('should call onNumberClick when number is clicked', () => {
      render(<NumberPad {...defaultProps} />);
      
      const button5 = screen.getByText('5');
      fireEvent.click(button5);
      
      expect(mockOnNumberClick).toHaveBeenCalledWith(5);
    });

    it('should handle all number clicks 1-9', () => {
      render(<NumberPad {...defaultProps} />);
      
      for (let i = 1; i <= 9; i++) {
        const button = screen.getByText(i.toString());
        fireEvent.click(button);
        expect(mockOnNumberClick).toHaveBeenCalledWith(i);
      }
      
      expect(mockOnNumberClick).toHaveBeenCalledTimes(9);
    });
  });

  describe('Erase Button', () => {
    it('should call onEraseClick when erase is clicked', () => {
      render(<NumberPad {...defaultProps} />);
      
      const eraseButton = screen.getByText(/erase/i);
      fireEvent.click(eraseButton);
      
      expect(mockOnEraseClick).toHaveBeenCalled();
    });
  });

  describe('Hint Button', () => {
    it('should call onHintClick when hint is clicked', () => {
      render(<NumberPad {...defaultProps} />);
      
      const hintButton = screen.getByText(/hint/i);
      fireEvent.click(hintButton);
      
      expect(mockOnHintClick).toHaveBeenCalled();
    });

    it('should disable hint button when no hints remaining', () => {
      const props = { ...defaultProps, hintsRemaining: 0 };
      render(<NumberPad {...props} />);
      
      const hintButton = screen.getByText(/hint/i);
      expect(hintButton).toBeDisabled();
    });

    it('should enable hint button when hints available', () => {
      render(<NumberPad {...defaultProps} />);
      
      const hintButton = screen.getByText(/hint/i);
      expect(hintButton).not.toBeDisabled();
    });
  });

  describe('Keyboard Support', () => {
    it('should support keyboard navigation', () => {
      render(<NumberPad {...defaultProps} />);
      
      const button1 = screen.getByText('1');
      button1.focus();
      
      expect(document.activeElement).toBe(button1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative hints remaining', () => {
      const props = { ...defaultProps, hintsRemaining: -1 };
      render(<NumberPad {...props} />);
      
      const hintButton = screen.getByText(/hint/i);
      expect(hintButton).toBeDisabled();
    });

    it('should handle large hints remaining', () => {
      const props = { ...defaultProps, hintsRemaining: 99 };
      render(<NumberPad {...props} />);
      
      expect(screen.getByText(/99/)).toBeInTheDocument();
    });
  });
});
