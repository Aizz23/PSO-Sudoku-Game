import { createContext, useState, useContext, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggleMusic = useCallback(() => {
    if (!audioRef.current) {
      // eslint-disable-next-line no-undef
      audioRef.current = new Audio('/music/background-music.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((error) => {
        console.error('Error playing music:', error);
      });
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const stopMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const playMusic = useCallback(() => {
    if (!audioRef.current) {
      // eslint-disable-next-line no-undef
      audioRef.current = new Audio('/music/background-music.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
    }
    audioRef.current.play().catch((error) => {
      console.error('Error playing music:', error);
    });
    setIsPlaying(true);
  }, []);

  return (
    <MusicContext.Provider
      value={{ isPlaying, toggleMusic, stopMusic, playMusic }}
    >
      {children}
    </MusicContext.Provider>
  );
};

MusicProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within MusicProvider');
  }
  return context;
};
