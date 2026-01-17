import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGame } from '@/contexts/GameContext';
import { useSound } from '@/hooks/useSound';
import { WORD_SEARCH_LEVELS } from '@/data/wordSearchData';
import { ArrowLeft, Lightbulb, Pause, RotateCcw, Star, Check } from 'lucide-react';

interface WordPosition {
  word: string;
  cells: { row: number; col: number }[];
  found: boolean;
}

const DIRECTIONS = [
  { row: 0, col: 1 },   // right
  { row: 1, col: 0 },   // down
  { row: 1, col: 1 },   // diagonal down-right
  { row: -1, col: 1 },  // diagonal up-right
  { row: 0, col: -1 },  // left
  { row: -1, col: 0 },  // up
  { row: -1, col: -1 }, // diagonal up-left
  { row: 1, col: -1 },  // diagonal down-left
];

const WordSearchGame = () => {
  const { progress, updateWordSearchProgress } = useGame();
  const { playSelect, playWordFound, playSuccess } = useSound();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [grid, setGrid] = useState<string[][]>([]);
  const [wordPositions, setWordPositions] = useState<WordPosition[]>([]);
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([]);
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const [timer, setTimer] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [filter, setFilter] = useState<'all' | 'AT' | 'NT'>('all');
  const [hintsUsed, setHintsUsed] = useState(0);

  const levelData = selectedLevel ? WORD_SEARCH_LEVELS.find(l => l.id === selectedLevel) : null;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedLevel && !isComplete) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [selectedLevel, isComplete]);

  const generateGrid = useCallback(() => {
    if (!levelData) return;
    
    const size = levelData.gridSize;
    const newGrid: string[][] = Array(size).fill(null).map(() => 
      Array(size).fill('').map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    );
    
    const positions: WordPosition[] = [];
    
    // Place words
    levelData.words.forEach(word => {
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 100) {
        const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
        const startRow = Math.floor(Math.random() * size);
        const startCol = Math.floor(Math.random() * size);
        
        // Check if word fits
        const cells: { row: number; col: number }[] = [];
        let fits = true;
        
        for (let i = 0; i < word.length; i++) {
          const row = startRow + dir.row * i;
          const col = startCol + dir.col * i;
          
          if (row < 0 || row >= size || col < 0 || col >= size) {
            fits = false;
            break;
          }
          
          if (newGrid[row][col] !== word[i] && newGrid[row][col] !== String.fromCharCode(65 + Math.floor(Math.random() * 26))) {
            // Check if cell already has a different letter from another word
            const existingLetter = newGrid[row][col];
            if (existingLetter !== word[i] && positions.some(p => p.cells.some(c => c.row === row && c.col === col))) {
              fits = false;
              break;
            }
          }
          
          cells.push({ row, col });
        }
        
        if (fits && cells.length === word.length) {
          // Place the word
          cells.forEach((cell, i) => {
            newGrid[cell.row][cell.col] = word[i];
          });
          positions.push({ word, cells, found: false });
          placed = true;
        }
        
        attempts++;
      }
    });
    
    setGrid(newGrid);
    setWordPositions(positions);
    setFoundCells(new Set());
    setSelectedCells([]);
    setTimer(0);
    setIsComplete(false);
    setHintsUsed(0);
  }, [levelData]);

  const startLevel = (id: number) => {
    setSelectedLevel(id);
    setTimeout(() => generateGrid(), 100);
  };

  useEffect(() => {
    if (selectedLevel && levelData) {
      generateGrid();
    }
  }, [selectedLevel, generateGrid]);

  const handleCellClick = (row: number, col: number) => {
    if (isComplete) return;
    playSelect();
    
    const cellKey = `${row}-${col}`;
    const lastCell = selectedCells[selectedCells.length - 1];
    
    // Check if this is a valid next cell (adjacent to last selected)
    if (selectedCells.length > 0 && lastCell) {
      const rowDiff = Math.abs(row - lastCell.row);
      const colDiff = Math.abs(col - lastCell.col);
      
      if (rowDiff > 1 || colDiff > 1) {
        // Start new selection
        setSelectedCells([{ row, col }]);
        return;
      }
    }
    
    // Add cell to selection
    const newSelection = [...selectedCells, { row, col }];
    setSelectedCells(newSelection);
    
    // Check if selection forms a word
    const selectedWord = newSelection.map(c => grid[c.row][c.col]).join('');
    const reversedWord = selectedWord.split('').reverse().join('');
    
    const foundWord = wordPositions.find(wp => 
      !wp.found && (wp.word === selectedWord || wp.word === reversedWord)
    );
    
    if (foundWord) {
      playWordFound();
      
      // Mark word as found
      setWordPositions(prev => prev.map(wp => 
        wp.word === foundWord.word ? { ...wp, found: true } : wp
      ));
      
      // Add cells to found set
      const newFoundCells = new Set(foundCells);
      newSelection.forEach(c => newFoundCells.add(`${c.row}-${c.col}`));
      setFoundCells(newFoundCells);
      setSelectedCells([]);
      
      // Check completion
      const allFound = wordPositions.filter(wp => wp.found).length + 1 === wordPositions.length;
      if (allFound) {
        setIsComplete(true);
        playSuccess();
        const stars = timer < 180 ? 3 : timer < 300 ? 2 : 1;
        updateWordSearchProgress(selectedLevel!, timer, stars, levelData?.words.length || 0);
      }
    }
  };

  const useHint = () => {
    if (hintsUsed >= 3) return;
    
    const unfoundWord = wordPositions.find(wp => !wp.found);
    if (unfoundWord && unfoundWord.cells[0]) {
      const cell = unfoundWord.cells[0];
      setSelectedCells([cell]);
      setHintsUsed(prev => prev + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Level Selection
  if (!selectedLevel) {
    const filteredLevels = filter === 'all' ? WORD_SEARCH_LEVELS : WORD_SEARCH_LEVELS.filter(l => l.testament === filter);
    
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-center">Caça-Palavras Bíblico</h2>
        
        <div className="flex justify-center gap-2 mb-4">
          <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>Todos</Button>
          <Button variant={filter === 'AT' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('AT')}>📖 AT</Button>
          <Button variant={filter === 'NT' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('NT')}>✝️ NT</Button>
        </div>
        
        <div className="grid grid-cols-5 gap-2 max-h-[60vh] overflow-auto">
          {filteredLevels.map(level => {
            const isCompleted = progress.wordSearch.completedLevels.includes(level.id);
            const isUnlocked = level.id <= progress.wordSearch.currentLevel;
            
            return (
              <Button
                key={level.id}
                variant={isCompleted ? "default" : "outline"}
                disabled={!isUnlocked}
                onClick={() => startLevel(level.id)}
                className="h-12 relative"
              >
                {isUnlocked ? level.id : '🔒'}
                {isCompleted && <Check className="h-3 w-3 absolute top-1 right-1" />}
              </Button>
            );
          })}
        </div>
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          {progress.wordSearch.completedLevels.length}/100 completos
        </div>
      </div>
    );
  }

  // Game Screen
  return (
    <div className="p-2 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-2">
        <Button variant="ghost" size="sm" onClick={() => setSelectedLevel(null)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="text-center">
          <div className="font-bold text-sm">Nível {selectedLevel}: {levelData?.title}</div>
        </div>
        <div className="font-mono">{formatTime(timer)}</div>
      </div>

      {/* Grid */}
      <div className="overflow-auto">
        <div 
          className="grid gap-0.5 mx-auto mb-2"
          style={{ 
            gridTemplateColumns: `repeat(${levelData?.gridSize || 8}, minmax(0, 1fr))`,
            maxWidth: `${(levelData?.gridSize || 8) * 32}px`
          }}
        >
          {grid.map((row, rowIdx) => 
            row.map((cell, colIdx) => {
              const cellKey = `${rowIdx}-${colIdx}`;
              const isSelected = selectedCells.some(c => c.row === rowIdx && c.col === colIdx);
              const isFound = foundCells.has(cellKey);
              
              return (
                <button
                  key={cellKey}
                  onClick={() => handleCellClick(rowIdx, colIdx)}
                  className={`aspect-square text-xs font-bold rounded transition-all
                    ${isFound ? 'bg-success text-success-foreground' : ''}
                    ${isSelected ? 'bg-primary text-primary-foreground' : ''}
                    ${!isFound && !isSelected ? 'bg-card hover:bg-muted' : ''}`}
                  style={{ width: '28px', height: '28px' }}
                >
                  {cell}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Words List */}
      <Card className="p-2 mb-2">
        <div className="text-xs font-medium mb-1">
          Palavras: {wordPositions.filter(w => w.found).length}/{wordPositions.length}
        </div>
        <div className="flex flex-wrap gap-1">
          {wordPositions.map(wp => (
            <span
              key={wp.word}
              className={`text-xs px-1 rounded ${wp.found ? 'bg-success/20 line-through text-muted-foreground' : 'bg-muted'}`}
            >
              {wp.word}
            </span>
          ))}
        </div>
      </Card>

      {/* Controls */}
      <div className="flex justify-center gap-2">
        <Button variant="outline" size="sm" onClick={useHint} disabled={hintsUsed >= 3}>
          <Lightbulb className="h-4 w-4 mr-1" /> Dica ({3 - hintsUsed})
        </Button>
        <Button variant="outline" size="sm" onClick={generateGrid}>
          <RotateCcw className="h-4 w-4 mr-1" /> Reiniciar
        </Button>
      </div>

      {/* Complete Modal */}
      {isComplete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 text-center max-w-sm mx-4">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-bold text-primary mb-2">Amém!</h3>
            <p className="font-medium mb-2">{levelData?.title}</p>
            <p className="text-xs text-muted-foreground mb-4">{levelData?.verseReference}</p>
            <div className="flex justify-center gap-1 mb-4">
              {[1, 2, 3].map(star => (
                <Star key={star} className={`h-8 w-8 ${star <= (timer < 180 ? 3 : timer < 300 ? 2 : 1) ? 'text-secondary fill-secondary' : 'text-muted'}`} />
              ))}
            </div>
            <p className="text-sm mb-4">Tempo: {formatTime(timer)}</p>
            <Button onClick={() => setSelectedLevel(null)}>Continuar</Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WordSearchGame;
