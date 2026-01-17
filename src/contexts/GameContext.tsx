import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { GameProgress, UserSettings } from '@/types/game';

interface GameContextType {
  progress: GameProgress;
  settings: UserSettings;
  loading: boolean;
  updateProgress: (updates: Partial<GameProgress>) => Promise<void>;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
  updateTileMatchProgress: (level: number, stars: number, blessings: number) => Promise<void>;
  updatePuzzleProgress: (puzzleId: number, time: number, stars: number) => Promise<void>;
  updateWordSearchProgress: (levelId: number, time: number, stars: number, wordsFound: number) => Promise<void>;
}

const defaultProgress: GameProgress = {
  tileMatch: {
    currentLevel: 1,
    completedLevels: [],
    totalStars: 0,
    blessings: 0,
  },
  puzzle: {
    completedPuzzles: [],
    bestTimes: {},
    totalStars: 0,
  },
  wordSearch: {
    currentLevel: 1,
    completedLevels: [],
    bestTimes: {},
    totalStars: 0,
    totalWordsFound: 0,
  },
  achievements: [],
  totalPlayTime: 0,
  consecutiveDays: 0,
  lastPlayedAt: null,
};

const defaultSettings: UserSettings = {
  soundEnabled: true,
  musicEnabled: true,
  showHints: true,
  darkMode: false,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<GameProgress>(defaultProgress);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      // Load from localStorage for guests
      const savedProgress = localStorage.getItem('gameProgress');
      const savedSettings = localStorage.getItem('gameSettings');
      
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      setLoading(false);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      // Load progress
      const { data: progressData } = await supabase
        .from('game_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (progressData) {
        setProgress({
          tileMatch: {
            currentLevel: progressData.tile_match_level,
            completedLevels: progressData.tile_match_completed_levels || [],
            totalStars: progressData.tile_match_stars,
            blessings: progressData.tile_match_blessings,
          },
          puzzle: {
            completedPuzzles: progressData.puzzle_completed || [],
            bestTimes: (progressData.puzzle_best_times as Record<number, number>) || {},
            totalStars: progressData.puzzle_stars,
          },
          wordSearch: {
            currentLevel: progressData.wordsearch_level,
            completedLevels: progressData.wordsearch_completed_levels || [],
            bestTimes: (progressData.wordsearch_best_times as Record<number, number>) || {},
            totalStars: progressData.wordsearch_stars,
            totalWordsFound: progressData.wordsearch_total_words_found,
          },
          achievements: [],
          totalPlayTime: progressData.total_play_time_seconds,
          consecutiveDays: progressData.consecutive_days,
          lastPlayedAt: progressData.last_played_at ? new Date(progressData.last_played_at) : null,
        });
      }

      // Load settings
      const { data: settingsData } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (settingsData) {
        setSettings({
          soundEnabled: settingsData.sound_enabled,
          musicEnabled: settingsData.music_enabled,
          showHints: settingsData.show_hints,
          darkMode: settingsData.dark_mode,
        });
      }

      // Load achievements
      const { data: achievementsData } = await supabase
        .from('achievements')
        .select('achievement_id')
        .eq('user_id', user.id);

      if (achievementsData) {
        setProgress(prev => ({
          ...prev,
          achievements: achievementsData.map(a => a.achievement_id),
        }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (updates: Partial<GameProgress>) => {
    const newProgress = { ...progress, ...updates };
    setProgress(newProgress);

    if (user) {
      await supabase
        .from('game_progress')
        .update({
          tile_match_level: newProgress.tileMatch.currentLevel,
          tile_match_completed_levels: newProgress.tileMatch.completedLevels,
          tile_match_stars: newProgress.tileMatch.totalStars,
          tile_match_blessings: newProgress.tileMatch.blessings,
          puzzle_completed: newProgress.puzzle.completedPuzzles,
          puzzle_best_times: newProgress.puzzle.bestTimes,
          puzzle_stars: newProgress.puzzle.totalStars,
          wordsearch_level: newProgress.wordSearch.currentLevel,
          wordsearch_completed_levels: newProgress.wordSearch.completedLevels,
          wordsearch_best_times: newProgress.wordSearch.bestTimes,
          wordsearch_stars: newProgress.wordSearch.totalStars,
          wordsearch_total_words_found: newProgress.wordSearch.totalWordsFound,
          total_play_time_seconds: newProgress.totalPlayTime,
          consecutive_days: newProgress.consecutiveDays,
          last_played_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
    } else {
      localStorage.setItem('gameProgress', JSON.stringify(newProgress));
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);

    if (user) {
      await supabase
        .from('user_settings')
        .update({
          sound_enabled: newSettings.soundEnabled,
          music_enabled: newSettings.musicEnabled,
          show_hints: newSettings.showHints,
          dark_mode: newSettings.darkMode,
        })
        .eq('user_id', user.id);
    } else {
      localStorage.setItem('gameSettings', JSON.stringify(newSettings));
    }
  };

  const updateTileMatchProgress = async (level: number, stars: number, blessings: number) => {
    const newCompletedLevels = progress.tileMatch.completedLevels.includes(level)
      ? progress.tileMatch.completedLevels
      : [...progress.tileMatch.completedLevels, level];

    await updateProgress({
      tileMatch: {
        currentLevel: Math.max(progress.tileMatch.currentLevel, level + 1),
        completedLevels: newCompletedLevels,
        totalStars: progress.tileMatch.totalStars + stars,
        blessings: progress.tileMatch.blessings + blessings,
      },
    });
  };

  const updatePuzzleProgress = async (puzzleId: number, time: number, stars: number) => {
    const currentBestTime = progress.puzzle.bestTimes[puzzleId];
    const newBestTime = currentBestTime ? Math.min(currentBestTime, time) : time;
    
    const newCompletedPuzzles = progress.puzzle.completedPuzzles.includes(puzzleId)
      ? progress.puzzle.completedPuzzles
      : [...progress.puzzle.completedPuzzles, puzzleId];

    await updateProgress({
      puzzle: {
        completedPuzzles: newCompletedPuzzles,
        bestTimes: { ...progress.puzzle.bestTimes, [puzzleId]: newBestTime },
        totalStars: progress.puzzle.totalStars + stars,
      },
    });
  };

  const updateWordSearchProgress = async (levelId: number, time: number, stars: number, wordsFound: number) => {
    const currentBestTime = progress.wordSearch.bestTimes[levelId];
    const newBestTime = currentBestTime ? Math.min(currentBestTime, time) : time;
    
    const newCompletedLevels = progress.wordSearch.completedLevels.includes(levelId)
      ? progress.wordSearch.completedLevels
      : [...progress.wordSearch.completedLevels, levelId];

    await updateProgress({
      wordSearch: {
        currentLevel: Math.max(progress.wordSearch.currentLevel, levelId + 1),
        completedLevels: newCompletedLevels,
        bestTimes: { ...progress.wordSearch.bestTimes, [levelId]: newBestTime },
        totalStars: progress.wordSearch.totalStars + stars,
        totalWordsFound: progress.wordSearch.totalWordsFound + wordsFound,
      },
    });
  };

  return (
    <GameContext.Provider value={{
      progress,
      settings,
      loading,
      updateProgress,
      updateSettings,
      updateTileMatchProgress,
      updatePuzzleProgress,
      updateWordSearchProgress,
    }}>
      {children}
    </GameContext.Provider>
  );
};
