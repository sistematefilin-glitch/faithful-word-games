import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGame } from '@/contexts/GameContext';
import { useSound } from '@/hooks/useSound';
import { usePuzzleImage, fetchExistingPuzzleImages } from '@/hooks/usePuzzleImage';
import { PUZZLE_IMAGES } from '@/data/puzzleData';
import { ArrowLeft, Eye, RotateCcw, Star, Loader2, Grid3X3, HelpCircle } from 'lucide-react';
import { PuzzlePieceSvg } from '@/components/games/PuzzlePieceSvg';

type RevealPhase = 'none' | 'assembling' | 'merging' | 'complete';

interface PuzzlePiece {
  id: number;
  correctPos: number;
  currentPos: number; // -1 means in the pieces area, >= 0 means on the board
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
  const [showBorders, setShowBorders] = useState(true);
  const [filter, setFilter] = useState<'all' | 'AT' | 'NT'>('all');
  const [existingImages, setExistingImages] = useState<Record<number, string>>({});
  const [revealPhase, setRevealPhase] = useState<RevealPhase>('none');
  const revealTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const puzzleData = selectedPuzzle ? PUZZLE_IMAGES.find(p => p.id === selectedPuzzle) : null;
  const { imageUrl, isLoading: isImageLoading } = usePuzzleImage(selectedPuzzle);

  // Load existing images on mount
  useEffect(() => {
    fetchExistingPuzzleImages().then(setExistingImages);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedPuzzle && !isComplete && !isImageLoading && imageUrl) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [selectedPuzzle, isComplete, isImageLoading, imageUrl]);

  const startPuzzle = (id: number) => {
    // Clear any existing reveal timeouts
    revealTimeoutsRef.current.forEach(t => clearTimeout(t));
    revealTimeoutsRef.current = [];
    
    setSelectedPuzzle(id);
    setTimer(0);
    setIsComplete(false);
    setSelectedPiece(null);
    setRevealPhase('none');
    
    // Create pieces - all start in the "available" area (currentPos = -1)
    const newPieces: PuzzlePiece[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      correctPos: i,
      currentPos: -1, // -1 means not on board yet
    }));
    
    // Shuffle the pieces array order for display in available area
    for (let i = newPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPieces[i], newPieces[j]] = [newPieces[j], newPieces[i]];
    }
    
    setPieces(newPieces);
  };
  
  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      revealTimeoutsRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  const handleBoardSlotClick = (boardPos: number) => {
    if (isComplete || isImageLoading) return;

    const pieceOnBoard = pieces.find(p => p.currentPos === boardPos);

    if (selectedPiece !== null) {
      // We have a selected piece
      const selected = pieces.find(p => p.id === selectedPiece);
      if (!selected) return;

      playSelect();

      if (pieceOnBoard) {
        // Swap: selected piece goes to boardPos, piece on board goes to selected's position
        const newPieces = pieces.map(p => {
          if (p.id === selectedPiece) {
            return { ...p, currentPos: boardPos };
          }
          if (p.id === pieceOnBoard.id) {
            return { ...p, currentPos: selected.currentPos };
          }
          return p;
        });
        setPieces(newPieces);
        checkCompletion(newPieces);
      } else {
        // Empty slot: move selected piece there
        const newPieces = pieces.map(p => {
          if (p.id === selectedPiece) {
            return { ...p, currentPos: boardPos };
          }
          return p;
        });
        setPieces(newPieces);
        checkCompletion(newPieces);
      }
      setSelectedPiece(null);
    } else if (pieceOnBoard) {
      // Select the piece on this board position
      setSelectedPiece(pieceOnBoard.id);
      playSelect();
    }
  };

  const handleAvailablePieceClick = (piece: PuzzlePiece) => {
    if (isComplete || isImageLoading) return;
    playSelect();

    if (selectedPiece === piece.id) {
      // Deselect
      setSelectedPiece(null);
    } else if (selectedPiece !== null) {
      // Swap with another available piece or piece on board
      const selected = pieces.find(p => p.id === selectedPiece);
      if (!selected) return;

      const newPieces = pieces.map(p => {
        if (p.id === selectedPiece) {
          return { ...p, currentPos: piece.currentPos };
        }
        if (p.id === piece.id) {
          return { ...p, currentPos: selected.currentPos };
        }
        return p;
      });
      setPieces(newPieces);
      setSelectedPiece(null);
      checkCompletion(newPieces);
    } else {
      // Select this piece
      setSelectedPiece(piece.id);
    }
  };

  const checkCompletion = useCallback((currentPieces: PuzzlePiece[]) => {
    if (revealPhase !== 'none') return;
    
    const allCorrect = currentPieces.every(p => p.currentPos === p.correctPos);
    if (allCorrect) {
      playSuccess();
      
      // Clear any existing timeouts
      revealTimeoutsRef.current.forEach(t => clearTimeout(t));
      revealTimeoutsRef.current = [];
      
      // Start reveal animation sequence
      setRevealPhase('assembling');
      
      const timeout1 = setTimeout(() => setRevealPhase('merging'), 800);
      const timeout2 = setTimeout(() => {
        setRevealPhase('complete');
        setIsComplete(true);
        const stars = timer < 180 ? 3 : timer < 300 ? 2 : 1;
        updatePuzzleProgress(selectedPuzzle!, timer, stars);
      }, 1800);
      
      revealTimeoutsRef.current = [timeout1, timeout2];
    } else {
      const correctCount = currentPieces.filter(p => p.currentPos === p.correctPos).length;
      if (correctCount > 0) {
        playMatch();
      }
    }
  }, [playSuccess, playMatch, timer, selectedPuzzle, updatePuzzleProgress, revealPhase]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get pieces on board and available pieces
  const piecesOnBoard = pieces.filter(p => p.currentPos >= 0);
  const availablePieces = pieces.filter(p => p.currentPos === -1);
  const correctCount = pieces.filter(p => p.currentPos === p.correctPos).length;

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
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[60vh] overflow-auto p-1">
          {filteredPuzzles.map(puzzle => {
            const isCompleted = progress.puzzle.completedPuzzles.includes(puzzle.id);
            const hasImage = !!existingImages[puzzle.id];
            return (
              <Card
                key={puzzle.id}
                className={`p-2 cursor-pointer hover:shadow-lg hover:scale-105 transition-all ${isCompleted ? 'border-success ring-2 ring-success/30' : ''}`}
                onClick={() => startPuzzle(puzzle.id)}
              >
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center text-4xl mb-2 overflow-hidden relative">
                  {hasImage ? (
                    <img 
                      src={existingImages[puzzle.id]} 
                      alt={puzzle.title}
                      className="w-full h-full object-cover"
                    />
                  ) : isCompleted ? (
                    <span className="text-success">✓</span>
                  ) : (
                    <span className="text-primary/40 font-bold">{puzzle.id}</span>
                  )}
                  {isCompleted && hasImage && (
                    <div className="absolute inset-0 bg-success/20 flex items-center justify-center">
                      <span className="text-4xl">✓</span>
                    </div>
                  )}
                </div>
                <div className="text-xs font-medium truncate">{puzzle.title}</div>
                <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                  {puzzle.category}
                  {hasImage && <span className="text-success">🖼️</span>}
                </div>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          {progress.puzzle.completedPuzzles.length}/100 completos • {Object.keys(existingImages).length} imagens geradas
        </div>
      </div>
    );
  }

  // Loading state
  if (isImageLoading) {
    return (
      <div className="p-4 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h3 className="text-lg font-semibold text-primary mb-2">Gerando imagem bíblica...</h3>
        <p className="text-sm text-muted-foreground text-center">
          {puzzleData?.title}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Isto pode levar alguns segundos
        </p>
        <Button 
          variant="ghost" 
          size="sm" 
          className="mt-4"
          onClick={() => setSelectedPuzzle(null)}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Cancelar
        </Button>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <Button variant="ghost" size="sm" onClick={() => setSelectedPuzzle(null)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Galeria
        </Button>
        <div className="text-center flex-1">
          <div className="font-bold text-sm truncate">{puzzleData?.title}</div>
        </div>
        <div className="flex items-center gap-2">
          {/* View button next to timer */}
          <Button 
            variant="outline" 
            size="icon"
            className="h-8 w-8"
            onMouseDown={() => setShowGuide(true)} 
            onMouseUp={() => setShowGuide(false)} 
            onMouseLeave={() => setShowGuide(false)}
            onTouchStart={() => setShowGuide(true)}
            onTouchEnd={() => setShowGuide(false)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <div className="font-mono text-lg">{formatTime(timer)}</div>
        </div>
      </div>

      {/* BOARD AREA - Where pieces are placed */}
      <div className="mb-6">
        <div className="text-sm text-muted-foreground text-center mb-2 flex items-center justify-center gap-2">
          <Grid3X3 className="h-3 w-3" />
          Tabuleiro ({correctCount}/25 corretas)
        </div>
        <div className={`relative bg-muted/50 rounded-xl p-3 border-2 border-dashed border-muted-foreground/30 max-w-md mx-auto transition-all duration-700 ${revealPhase === 'merging' || revealPhase === 'complete' ? 'p-0 border-0 overflow-hidden' : ''}`}>
          {showGuide && imageUrl && revealPhase === 'none' && (
            <div className="absolute inset-2 z-10 rounded-lg overflow-hidden pointer-events-none">
              <img 
                src={imageUrl} 
                alt={puzzleData?.title}
                className="w-full h-full object-cover opacity-70"
              />
            </div>
          )}
          
          {/* Divine glow overlay during reveal */}
          {(revealPhase === 'assembling' || revealPhase === 'merging') && (
            <div 
              className="absolute inset-0 pointer-events-none rounded-xl z-20 animate-divine-reveal"
              style={{
                background: 'radial-gradient(circle at center, hsl(var(--secondary) / 0.5) 0%, transparent 70%)',
              }}
            />
          )}
          
          <div className={`grid grid-cols-5 aspect-square transition-all duration-700 ${revealPhase === 'merging' || revealPhase === 'complete' ? 'gap-0' : 'gap-0'}`}>
            {Array.from({ length: 25 }).map((_, boardPos) => {
              const piece = piecesOnBoard.find(p => p.currentPos === boardPos);
              const isCorrect = piece && piece.correctPos === boardPos;
              const isSelected = piece && selectedPiece === piece.id;
              const isEmpty = !piece;
              const isRevealing = revealPhase !== 'none';
              const isMerging = revealPhase === 'merging' || revealPhase === 'complete';

              // Calculate background position for the piece
              const pieceRow = piece ? Math.floor(piece.id / 5) : 0;
              const pieceCol = piece ? piece.id % 5 : 0;

              return (
                <div key={boardPos} className={`relative transition-all duration-700 ${isMerging ? 'p-0' : 'p-0.5'}`}>
                  <button
                    onClick={() => !isRevealing && handleBoardSlotClick(boardPos)}
                    disabled={isRevealing}
                    className={`w-full h-full aspect-square transition-all overflow-visible relative
                      ${isEmpty ? 'bg-background/50 border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/10 rounded-md' : ''}
                      ${isCorrect && showBorders && !isRevealing ? 'ring-2 ring-success ring-offset-1' : ''}
                      ${isSelected && !isRevealing ? 'ring-3 ring-primary scale-110 z-20 shadow-lg' : ''}
                      ${!isEmpty && !isSelected && !isRevealing ? 'hover:scale-105 hover:z-10 hover:shadow-md cursor-pointer' : ''}
                      ${isEmpty && selectedPiece !== null && !isRevealing ? 'border-primary/50 bg-primary/10' : ''}
                      ${revealPhase === 'assembling' && piece ? 'animate-piece-glow' : ''}
                      ${isRevealing ? 'cursor-default' : ''}
                    `}
                  >
                    {piece && (
                      <PuzzlePieceSvg
                        pieceId={piece.id}
                        pieceCol={pieceCol}
                        pieceRow={pieceRow}
                        imageUrl={imageUrl}
                        disableClip={isMerging}
                        className="absolute inset-0 w-full h-full pointer-events-none"
                      />
                    )}
                    {isEmpty && !isRevealing && (
                      <span className="text-muted-foreground/30 text-xs">{boardPos + 1}</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AVAILABLE PIECES AREA */}
      <div className="mb-6">
        <div className="text-sm text-muted-foreground text-center mb-2">
          Peças disponíveis ({availablePieces.length} restantes)
        </div>
        <div className="bg-card rounded-xl p-4 border min-h-[140px] max-w-md mx-auto">
          {availablePieces.length === 0 ? (
            <div className="flex items-center justify-center h-24 text-muted-foreground text-base">
              Todas as peças foram colocadas no tabuleiro!
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-3">
              {availablePieces.map((piece) => {
                const isSelected = selectedPiece === piece.id;
                const pieceRow = Math.floor(piece.id / 5);
                const pieceCol = piece.id % 5;

                return (
                  <div key={piece.id} className="relative p-1">
                    <button
                      onClick={() => handleAvailablePieceClick(piece)}
                      title={`Peça ${piece.id + 1}`}
                      className={`w-full aspect-square transition-all overflow-visible shadow-md relative
                        ${isSelected ? 'ring-3 ring-primary scale-115 z-10 shadow-xl' : 'hover:scale-110 hover:shadow-lg'}
                      `}
                    >
                      <PuzzlePieceSvg
                        pieceId={piece.id}
                        pieceCol={pieceCol}
                        pieceRow={pieceRow}
                        imageUrl={imageUrl}
                        className="absolute inset-0 w-full h-full pointer-events-none"
                      />
                      {!imageUrl && (
                        <span className="relative z-10 text-muted-foreground text-sm font-bold">{piece.id + 1}</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <Button 
          variant={showBorders ? "default" : "outline"} 
          size="sm" 
          onClick={() => setShowBorders(!showBorders)}
        >
          <Grid3X3 className="h-4 w-4 mr-1" /> Bordas
        </Button>
        <Button variant="outline" size="sm" onClick={() => startPuzzle(selectedPuzzle)}>
          <RotateCcw className="h-4 w-4 mr-1" /> Reiniciar
        </Button>
      </div>

      {/* Instructions */}
      {availablePieces.length > 0 && !selectedPiece && (
        <div className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
          <HelpCircle className="h-3 w-3" />
          Clique em uma peça abaixo, depois clique onde quer colocá-la no tabuleiro
        </div>
      )}
      {selectedPiece !== null && (
        <div className="text-center text-xs text-primary font-medium animate-pulse">
          Peça selecionada! Clique no tabuleiro para posicionar
        </div>
      )}

      {/* Complete Modal - Full image without borders */}
      {isComplete && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-lg w-full animate-scale-in">
            {/* Full image as the main focus */}
            {imageUrl && (
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={imageUrl} 
                  alt={puzzleData?.title}
                  className="w-full h-auto"
                />
                
                {/* Gradient overlay with info at bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6">
                  <div className="flex items-center justify-center gap-1 mb-3">
                    <span className="text-3xl">🎉</span>
                    <h3 className="text-2xl font-bold text-white">Parabéns!</h3>
                  </div>
                  
                  <p className="font-semibold text-white text-center text-lg mb-1">{puzzleData?.title}</p>
                  <p className="text-white/80 text-sm text-center italic mb-1">"{puzzleData?.verse}"</p>
                  <p className="text-white/60 text-xs text-center mb-4">— {puzzleData?.verseReference}</p>
                  
                  <div className="flex justify-center gap-1 mb-3">
                    {[1, 2, 3].map(star => (
                      <Star 
                        key={star} 
                        className={`h-8 w-8 ${star <= (timer < 180 ? 3 : timer < 300 ? 2 : 1) ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-white/80 text-sm text-center mb-4">Tempo: {formatTime(timer)}</p>
                  
                  <Button 
                    onClick={() => setSelectedPuzzle(null)} 
                    className="w-full bg-white text-black hover:bg-white/90"
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            )}
            
            {/* Fallback if no image */}
            {!imageUrl && (
              <Card className="p-6 text-center">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="text-xl font-bold text-primary mb-2">Parabéns!</h3>
                <p className="font-medium mb-2">{puzzleData?.title}</p>
                <p className="text-muted-foreground text-sm mb-2 italic">"{puzzleData?.verse}"</p>
                <p className="text-xs mb-4 text-muted-foreground">— {puzzleData?.verseReference}</p>
                <div className="flex justify-center gap-1 mb-4">
                  {[1, 2, 3].map(star => (
                    <Star 
                      key={star} 
                      className={`h-8 w-8 ${star <= (timer < 180 ? 3 : timer < 300 ? 2 : 1) ? 'text-secondary fill-secondary' : 'text-muted'}`} 
                    />
                  ))}
                </div>
                <p className="text-sm mb-4">Tempo: {formatTime(timer)}</p>
                <Button onClick={() => setSelectedPuzzle(null)} className="w-full">Continuar</Button>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PuzzleGame;
