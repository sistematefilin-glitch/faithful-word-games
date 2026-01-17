// Game Types for Jogos da Fé

// Tile Match Types
export interface TileType {
  id: string;
  icon: string;
  name: string;
  color: string;
}

export interface Tile {
  id: string;
  type: TileType;
  layer: number;
  position: { x: number; y: number };
  isBlocked: boolean;
  isSelected: boolean;
}

export interface TileMatchLevel {
  id: number;
  name: string;
  phase: string;
  tiles: number;
  layers: number;
  verse: string;
  verseReference: string;
}

// Puzzle Types
export interface PuzzlePiece {
  id: number;
  correctPosition: number;
  currentPosition: number;
  imageOffset: { x: number; y: number };
}

export interface PuzzleImage {
  id: number;
  title: string;
  category: string;
  testament: 'AT' | 'NT';
  verse: string;
  verseReference: string;
  imageUrl: string;
  difficulty: 'fácil' | 'médio' | 'difícil';
}

// Word Search Types
export interface WordSearchLevel {
  id: number;
  title: string;
  category: string;
  testament: 'AT' | 'NT';
  verseReference: string;
  words: string[];
  gridSize: number;
  difficulty: 'fácil' | 'médio' | 'difícil' | 'expert';
}

export interface WordPosition {
  word: string;
  startRow: number;
  startCol: number;
  direction: { row: number; col: number };
  found: boolean;
}

export interface CellSelection {
  row: number;
  col: number;
}

// Achievement Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

// User Progress Types
export interface GameProgress {
  tileMatch: {
    currentLevel: number;
    completedLevels: number[];
    totalStars: number;
    blessings: number;
  };
  puzzle: {
    completedPuzzles: number[];
    bestTimes: Record<number, number>;
    totalStars: number;
  };
  wordSearch: {
    currentLevel: number;
    completedLevels: number[];
    bestTimes: Record<number, number>;
    totalStars: number;
    totalWordsFound: number;
  };
  achievements: string[];
  totalPlayTime: number;
  consecutiveDays: number;
  lastPlayedAt: Date | null;
}

// Booster/Power-up Types
export interface Booster {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
}

// Settings Types
export interface UserSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  showHints: boolean;
  darkMode: boolean;
}
