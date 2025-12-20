import React from 'react';
import { useMusic } from '../context/MusicContext';
import './MusicPlayer.css';

const MusicPlayer = () => {
  const { isPlaying, toggleMusic } = useMusic();

  return (
    <div className="music-player">
      <button
        className={`music-toggle-btn ${isPlaying ? 'playing' : 'paused'}`}
        onClick={toggleMusic}
        title={isPlaying ? 'Turn off music' : 'Turn on music'}
      >
        <span className="music-icon">
          {isPlaying ? '🎵' : '🔇'}
        </span>
      </button>
      <span className="music-status">
        {isPlaying ? 'Music On' : 'Music Off'}
      </span>
    </div>
  );
};

export default MusicPlayer;
