import React from 'react';
import './SudokuBoard.css';

const SudokuBoard = ({ 
  puzzle, 
  currentState, 
  solution, 
  selectedCell, 
  onCellClick, 
  onCellChange
}) => {
  
  const getCellClassName = (row, col) => {
    const classes = ['sudoku-cell'];
    
    // Pre-filled cells
    if (puzzle[row][col] !== '-' && puzzle[row][col] !== '0') {
      classes.push('cell-prefilled');
    }
    
    // Selected cell
    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
      classes.push('cell-selected');
    }
    
    // Highlight same row, column, and box
    if (selectedCell) {
      if (selectedCell.row === row || selectedCell.col === col) {
        classes.push('cell-highlighted');
      }
      
      const boxRow = Math.floor(row / 3);
      const boxCol = Math.floor(col / 3);
      const selectedBoxRow = Math.floor(selectedCell.row / 3);
      const selectedBoxCol = Math.floor(selectedCell.col / 3);
      
      if (boxRow === selectedBoxRow && boxCol === selectedBoxCol) {
        classes.push('cell-highlighted');
      }
    }
    
    // Border classes for 3x3 boxes
    if (row === 2 || row === 5) classes.push('border-bottom-thick');
    if (col === 2 || col === 5) classes.push('border-right-thick');
    
    return classes.join(' ');
  };

  const handleCellClick = (row, col) => {
    if (puzzle[row][col] === '-' || puzzle[row][col] === '0') {
      onCellClick(row, col);
    }
  };

  return (
    <div className="sudoku-board-container">
      <div className="sudoku-board">
        {currentState.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getCellClassName(rowIndex, colIndex)}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell !== '-' && cell !== '0' ? cell : ''}
            </div>
          ))
        ))}
      </div>
    </div>
  );
};

export default SudokuBoard;
