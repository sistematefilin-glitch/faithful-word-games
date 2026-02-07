import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGame } from '@/contexts/GameContext';
import { useSound } from '@/hooks/useSound';
import { usePuzzleImage, fetchExistingPuzzleImages } from '@/hooks/usePuzzleImage';
import { PUZZLE_IMAGES } from '@/data/puzzleData';
import { ArrowLeft, Star, Loader2, RotateCcw, HelpCircle } from 'lucide-react';
import * as headbreaker from 'headbreaker';

const PuzzleGame = () => {
  const { progress, updatePuzzleProgress } = useGame();
  const { playSelect, playMatch, playSuccess } = useSound();
  const [selectedPuzzle, setSelectedPuzzle] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [filter, setFilter] = useState<'all' | 'AT' | 'NT'>('all');
  const [existingImages, setExistingImages] = useState<Record<number, string>>({});
  const canvasRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const puzzleData = selectedPuzzle ? PUZZLE_IMAGES.find(p => p.id === selectedPuzzle) : null;
  const { imageUrl, isLoading: isImageLoading } = usePuzzleImage(selectedPuzzle);

  // Load existing images on mount
  useEffect(() => {
    fetchExistingPuzzleImages().then(setExistingImages);
  }, []);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedPuzzle && !isComplete && !isImageLoading && imageUrl) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [selectedPuzzle, isComplete, isImageLoading, imageUrl]);

  // Initialize headbreaker when image is ready
  useEffect(() => {
    if (!selectedPuzzle || !imageUrl || isImageLoading || !containerRef.current) return;

    // Clear previous canvas
    const container = containerRef.current;
    container.innerHTML = '';
    
    // Create a unique ID
    const canvasId = `puzzle-canvas-${selectedPuzzle}`;
    const div = document.createElement('div');
    div.id = canvasId;
    container.appendChild(div);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    
    img.onload = () => {
      try {
        // Calculate size to fit the container
        const containerWidth = container.clientWidth || 400;
        const size = Math.min(containerWidth, 500);
        
        const canvas = new headbreaker.Canvas(canvasId, {
          width: size,
          height: size,
          pieceSize: Math.floor(size / 6),
          proximity: 15,
          borderFill: 8,
          strokeWidth: 1.5,
          lineSoftness: 0.18,
          image: img,
          fixed: true,
          painter: new headbreaker.painters.Konva(),
        });

        canvas.autogenerate({
          horizontalPiecesCount: 5,
          verticalPiecesCount: 5,
        });

        canvas.adjustImagesToPuzzleHeight();
        canvas.shuffle(0.8);
        canvas.draw();

        // Attach validation
        canvas.attachSolvedValidator();
        canvas.onValid(() => {
          playSuccess();
          setIsComplete(true);
          const stars = timer < 180 ? 3 : timer < 300 ? 2 : 1;
          updatePuzzleProgress(selectedPuzzle, timer, stars);
        });

        canvasRef.current = canvas;
      } catch (err) {
        console.error('Error initializing headbreaker:', err);
      }
    };

    img.onerror = () => {
      console.error('Failed to load image for puzzle');
    };

    return () => {
      canvasRef.current = null;
      container.innerHTML = '';
    };
  }, [selectedPuzzle, imageUrl, isImageLoading]);

  const startPuzzle = (id: number) => {
    setSelectedPuzzle(id);
    setTimer(0);
    setIsComplete(false);
    canvasRef.current = null;
  };

  const handleRestart = () => {
    if (selectedPuzzle) {
      setIsComplete(false);
      setTimer(0);
      // Re-trigger the effect by forcing a re-render
      const id = selectedPuzzle;
      setSelectedPuzzle(null);
      setTimeout(() => setSelectedPuzzle(id), 50);
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
          <div className="text-xs text-muted-foreground italic">"{puzzleData?.verse}"</div>
        </div>
        <div className="font-mono text-lg">{formatTime(timer)}</div>
      </div>

      {/* Headbreaker Canvas */}
      <div 
        ref={containerRef}
        className="w-full flex justify-center mb-4 min-h-[400px] bg-muted/30 rounded-xl border-2 border-dashed border-muted-foreground/20 overflow-hidden"
      />

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={handleRestart}>
          <RotateCcw className="h-4 w-4 mr-1" /> Reiniciar
        </Button>
      </div>

      {/* Instructions */}
      <div className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
        <HelpCircle className="h-3 w-3" />
        Arraste as peças para encaixá-las no lugar correto
      </div>

      {/* Complete Modal */}
      {isComplete && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-lg w-full animate-scale-in">
            {imageUrl && (
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={imageUrl} 
                  alt={puzzleData?.title}
                  className="w-full h-auto"
                />
                
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
