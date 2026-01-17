import { useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';

// Simple sound effects using Web Audio API
const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

export const useSound = () => {
  const { settings } = useGame();

  const playMatch = useCallback(() => {
    if (!settings.soundEnabled) return;
    // Happy ascending notes
    playTone(523, 0.1); // C5
    setTimeout(() => playTone(659, 0.1), 100); // E5
    setTimeout(() => playTone(784, 0.15), 200); // G5
  }, [settings.soundEnabled]);

  const playSelect = useCallback(() => {
    if (!settings.soundEnabled) return;
    playTone(440, 0.1, 'triangle');
  }, [settings.soundEnabled]);

  const playSuccess = useCallback(() => {
    if (!settings.soundEnabled) return;
    // Victory fanfare
    playTone(523, 0.15); // C5
    setTimeout(() => playTone(659, 0.15), 150); // E5
    setTimeout(() => playTone(784, 0.15), 300); // G5
    setTimeout(() => playTone(1047, 0.3), 450); // C6
  }, [settings.soundEnabled]);

  const playError = useCallback(() => {
    if (!settings.soundEnabled) return;
    playTone(200, 0.2, 'square');
  }, [settings.soundEnabled]);

  const playClick = useCallback(() => {
    if (!settings.soundEnabled) return;
    playTone(600, 0.05, 'sine');
  }, [settings.soundEnabled]);

  const playWordFound = useCallback(() => {
    if (!settings.soundEnabled) return;
    // "Amém" sound - peaceful ascending
    playTone(392, 0.1); // G4
    setTimeout(() => playTone(440, 0.1), 80); // A4
    setTimeout(() => playTone(523, 0.2), 160); // C5
  }, [settings.soundEnabled]);

  const playLevelComplete = useCallback(() => {
    if (!settings.soundEnabled) return;
    // Triumphant melody
    const notes = [523, 659, 784, 880, 1047];
    notes.forEach((note, i) => {
      setTimeout(() => playTone(note, 0.15), i * 100);
    });
  }, [settings.soundEnabled]);

  return {
    playMatch,
    playSelect,
    playSuccess,
    playError,
    playClick,
    playWordFound,
    playLevelComplete,
  };
};
