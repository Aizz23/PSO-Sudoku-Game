import React from 'react';
import './NumberPad.css';

const NumberPad = ({ onNumberSelect, selectedNumber }) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="number-pad">
      {numbers.map((num) => (
        <button
          key={num}
          className={`number-button ${selectedNumber === num ? 'selected' : ''}`}
          onClick={() => onNumberSelect(num)}
        >
          {num}
        </button>
      ))}
      <button
        className="number-button erase-button"
        onClick={() => onNumberSelect(null)}
      >
        ✖ Erase
      </button>
    </div>
  );
};

export default NumberPad;
