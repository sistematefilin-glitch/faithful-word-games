import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGame } from '@/contexts/GameContext';
import { useSound } from '@/hooks/useSound';
import { PUZZLE_IMAGES } from '@/data/puzzleData';
import { ArrowLeft, Eye, Lightbulb, RotateCcw, Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface PuzzlePiece {
  id: number;
  correctPos: number;
  currentPos: number;
}

const PuzzleGame = () => {
  const { progress, updatePuzzleProgress } = useGame();
  const { playSelect, playMatch, playSuccess } = useSound();
  const [selectedPuzzle, setSelectedPuzzle] = useState<number | null>(null);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [filter, setFilter] = useState<'all' | 'AT' | 'NT'>('all');

  const puzzleData = selectedPuzzle ? PUZZLE_IMAGES.find(p => p.id === selectedPuzzle) : null;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedPuzzle && !isComplete) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [selectedPuzzle, isComplete]);

  const startPuzzle = (id: number) => {
    setSelectedPuzzle(id);
    setTimer(0);
    setIsComplete(false);
    
    // Create shuffled pieces
    const newPieces: PuzzlePiece[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      correctPos: i,
      currentPos: i,
    }));
    
    // Shuffle positions
    for (let i = newPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPieces[i].currentPos, newPieces[j].currentPos] = [newPieces[j].currentPos, newPieces[i].currentPos];
    }
    
    setPieces(newPieces);
  };

  const handlePieceClick = (piece: PuzzlePiece) => {
    if (isComplete) return;
    playSelect();

    if (selectedPiece === null) {
      setSelectedPiece(piece.id);
    } else {
      // Swap pieces
      const newPieces = pieces.map(p => {
        if (p.id === selectedPiece) {
          return { ...p, currentPos: piece.currentPos };
        }
        if (p.id === piece.id) {
          return { ...p, currentPos: pieces.find(pp => pp.id === selectedPiece)!.currentPos };
        }
        return p;
      });
      
      setPieces(newPieces);
      setSelectedPiece(null);
      
      // Check for matches
      const correct = newPieces.filter(p => p.currentPos === p.correctPos).length;
      if (correct === 25) {
        setIsComplete(true);
        playSuccess();
        const stars = timer < 180 ? 3 : timer < 300 ? 2 : 1;
        updatePuzzleProgress(selectedPuzzle!, timer, stars);
      } else {
        playMatch();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Puzzle Selection Screen
  if (!selectedPuzzle) {
    const filteredPuzzles = filter === 'all' ? PUZZLE_IMAGES : PUZZLE_IMAGES.filter(p => p.testament === filter);
    
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-center">Galeria Bíblica</h2>
        
        <div className="flex justify-center gap-2 mb-4">
          <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>Todos</Button>
          <Button variant={filter === 'AT' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('AT')}>📖 AT</Button>
          <Button variant={filter === 'NT' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('NT')}>✝️ NT</Button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[60vh] overflow-auto">
          {filteredPuzzles.map(puzzle => {
            const isCompleted = progress.puzzle.completedPuzzles.includes(puzzle.id);
            return (
              <Card
                key={puzzle.id}
                className={`p-2 cursor-pointer hover:shadow-lg transition-all ${isCompleted ? 'border-success' : ''}`}
                onClick={() => startPuzzle(puzzle.id)}
              >
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded flex items-center justify-center text-3xl mb-1">
                  {isCompleted ? '✓' : puzzle.id}
                </div>
                <div className="text-xs truncate font-medium">{puzzle.title}</div>
                <div className="text-xs text-muted-foreground">{puzzle.category}</div>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          {progress.puzzle.completedPuzzles.length}/100 completos
        </div>
      </div>
    );
  }

  // Puzzle Game Screen
  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" size="sm" onClick={() => setSelectedPuzzle(null)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Galeria
        </Button>
        <div className="text-center">
          <div className="font-bold text-sm">{puzzleData?.title}</div>
          <div className="text-xs text-muted-foreground">{puzzleData?.category}</div>
        </div>
        <div className="font-mono text-lg">{formatTime(timer)}</div>
      </div>

      {/* Puzzle Grid */}
      <div className="relative">
        {showGuide && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-lg z-10 flex items-center justify-center">
            <span className="text-6xl">🖼️</span>
          </div>
        )}
        <div className="grid grid-cols-5 gap-1 aspect-square bg-muted rounded-lg p-1">
          {Array.from({ length: 25 }).map((_, pos) => {
            const piece = pieces.find(p => p.currentPos === pos);
            const isCorrect = piece && piece.currentPos === piece.correctPos;
            const isSelected = piece && selectedPiece === piece.id;
            
            return (
              <button
                key={pos}
                onClick={() => piece && handlePieceClick(piece)}
                className={`aspect-square rounded text-sm font-bold transition-all
                  ${isCorrect ? 'bg-success/20 text-success' : 'bg-card'}
                  ${isSelected ? 'ring-2 ring-primary scale-105' : ''}
                  hover:scale-105`}
              >
                {piece ? piece.id + 1 : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2 mt-4">
        <Button variant="outline" size="sm" onMouseDown={() => setShowGuide(true)} onMouseUp={() => setShowGuide(false)} onMouseLeave={() => setShowGuide(false)}>
          <Eye className="h-4 w-4 mr-1" /> Ver
        </Button>
        <Button variant="outline" size="sm" onClick={() => startPuzzle(selectedPuzzle)}>
          <RotateCcw className="h-4 w-4 mr-1" /> Reiniciar
        </Button>
      </div>

      {/* Correct count */}
      <div className="text-center mt-4 text-sm text-muted-foreground">
        {pieces.filter(p => p.currentPos === p.correctPos).length}/25 peças corretas
      </div>

      {/* Complete Modal */}
      {isComplete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 text-center max-w-sm mx-4">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-bold text-primary mb-2">Parabéns!</h3>
            <p className="font-medium mb-2">{puzzleData?.title}</p>
            <p className="text-muted-foreground text-sm mb-2">"{puzzleData?.verse}"</p>
            <p className="text-xs mb-4">— {puzzleData?.verseReference}</p>
            <div className="flex justify-center gap-1 mb-4">
              {[1, 2, 3].map(star => (
                <Star key={star} className={`h-8 w-8 ${star <= (timer < 180 ? 3 : timer < 300 ? 2 : 1) ? 'text-secondary fill-secondary' : 'text-muted'}`} />
              ))}
            </div>
            <p className="text-sm mb-4">Tempo: {formatTime(timer)}</p>
            <Button onClick={() => setSelectedPuzzle(null)}>Continuar</Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PuzzleGame;
