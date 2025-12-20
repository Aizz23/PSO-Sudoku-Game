/**
 * Unit Tests for NumberPad Component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NumberPad from '../components/NumberPad';

describe('NumberPad Component', () => {
  const mockOnNumberSelect = jest.fn();

  const defaultProps = {
    onNumberSelect: mockOnNumberSelect,
    selectedNumber: null,
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

    it('should highlight selected number', () => {
      const props = { ...defaultProps, selectedNumber: 5 };
      render(<NumberPad {...props} />);

      const button5 = screen.getByText('5');
      expect(button5).toHaveClass('selected');
    });
  });

  describe('Number Button Interactions', () => {
    it('should call onNumberSelect when number is clicked', () => {
      render(<NumberPad {...defaultProps} />);

      const button5 = screen.getByText('5');
      fireEvent.click(button5);

      expect(mockOnNumberSelect).toHaveBeenCalledWith(5);
    });

    it('should handle all number clicks 1-9', () => {
      render(<NumberPad {...defaultProps} />);

      for (let i = 1; i <= 9; i++) {
        const button = screen.getByText(i.toString());
        fireEvent.click(button);
        expect(mockOnNumberSelect).toHaveBeenCalledWith(i);
      }

      expect(mockOnNumberSelect).toHaveBeenCalledTimes(9);
    });
  });

  describe('Erase Button', () => {
    it('should call onNumberSelect with null when erase is clicked', () => {
      render(<NumberPad {...defaultProps} />);

      const eraseButton = screen.getByText(/erase/i);
      fireEvent.click(eraseButton);

      expect(mockOnNumberSelect).toHaveBeenCalledWith(null);
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

  describe('Selection State', () => {
    it('should not have selected class when no number selected', () => {
      render(<NumberPad {...defaultProps} />);

      const button3 = screen.getByText('3');
      expect(button3).not.toHaveClass('selected');
    });

    it('should have selected class on selected number', () => {
      const props = { ...defaultProps, selectedNumber: 7 };
      render(<NumberPad {...props} />);

      const button7 = screen.getByText('7');
      expect(button7).toHaveClass('selected');
    });

    it('should only highlight one number at a time', () => {
      const props = { ...defaultProps, selectedNumber: 4 };
      const { container } = render(<NumberPad {...props} />);

      const selectedButtons = container.querySelectorAll(
        '.number-button.selected'
      );
      expect(selectedButtons).toHaveLength(1);
    });
  });
});
