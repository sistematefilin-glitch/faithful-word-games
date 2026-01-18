import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGame } from '@/contexts/GameContext';
import { useSound } from '@/hooks/useSound';
import { TILE_TYPES, TILE_MATCH_LEVELS, MOTIVATIONAL_MESSAGES, BOOSTERS } from '@/data/tileMatchData';
import { Tile, TileType } from '@/types/game';
import { ArrowLeft, RotateCcw, Shuffle, Lightbulb, Plus, Star } from 'lucide-react';

const TileMatchGame = () => {
  const { progress, updateTileMatchProgress } = useGame();
  const { playSelect, playMatch, playSuccess, playError } = useSound();
  const [currentLevel, setCurrentLevel] = useState(progress.tileMatch.currentLevel);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<Tile[]>([]);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [showLevelSelect, setShowLevelSelect] = useState(true);
  const [score, setScore] = useState(0);

  const levelData = TILE_MATCH_LEVELS[currentLevel - 1];

  const generateTiles = useCallback(() => {
    if (!levelData) return;
    
    const newTiles: Tile[] = [];
    const numPairs = Math.floor(levelData.tiles / 3);
    
    for (let i = 0; i < numPairs; i++) {
      const tileType = TILE_TYPES[i % TILE_TYPES.length];
      for (let j = 0; j < 3; j++) {
        newTiles.push({
          id: `${i}-${j}-${Math.random()}`,
          type: tileType,
          layer: Math.floor(Math.random() * levelData.layers),
          position: { x: Math.random() * 5, y: Math.random() * 5 },
          isBlocked: false,
          isSelected: false,
        });
      }
    }
    
    // Shuffle and assign positions
    const shuffled = newTiles.sort(() => Math.random() - 0.5);
    const cols = 6;
    shuffled.forEach((tile, index) => {
      tile.position = { x: index % cols, y: Math.floor(index / cols) };
    });
    
    setTiles(shuffled);
    setSelectedTiles([]);
    setScore(0);
    setGameOver(false);
    setLevelComplete(false);
  }, [levelData]);

  const handleTileClick = (tile: Tile) => {
    if (selectedTiles.length >= 7 || gameOver || levelComplete) return;
    
    playSelect();
    const newSelected = [...selectedTiles, tile];
    setSelectedTiles(newSelected);
    setTiles(tiles.filter(t => t.id !== tile.id));
    
    // Check for matches
    const typeCount: Record<string, Tile[]> = {};
    newSelected.forEach(t => {
      if (!typeCount[t.type.id]) typeCount[t.type.id] = [];
      typeCount[t.type.id].push(t);
    });
    
    Object.entries(typeCount).forEach(([typeId, typeTiles]) => {
      if (typeTiles.length >= 3) {
        playMatch();
        const randomMsg = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
        setMessage(randomMsg);
        setTimeout(() => setMessage(''), 1500);
        
        setScore(prev => prev + 100);
        setSelectedTiles(prev => prev.filter(t => t.type.id !== typeId));
      }
    });
    
    // Check win/lose
    setTimeout(() => {
      if (tiles.length <= 1 && selectedTiles.length <= 4) {
        setLevelComplete(true);
        playSuccess();
        const stars = selectedTiles.length <= 2 ? 3 : selectedTiles.length <= 4 ? 2 : 1;
        updateTileMatchProgress(currentLevel, stars, score + 500);
      } else if (newSelected.length >= 7) {
        const hasMatch = Object.values(typeCount).some(arr => arr.length >= 3);
        if (!hasMatch) {
          setGameOver(true);
          playError();
        }
      }
    }, 100);
  };

  const startLevel = (level: number) => {
    setCurrentLevel(level);
    setShowLevelSelect(false);
  };

  useEffect(() => {
    if (!showLevelSelect && levelData) {
      generateTiles();
    }
  }, [showLevelSelect, currentLevel, generateTiles]);

  if (showLevelSelect) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-center">Selecione o Nível</h2>
        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
          {TILE_MATCH_LEVELS.map((level, idx) => {
            const isUnlocked = idx + 1 <= progress.tileMatch.currentLevel;
            const isCompleted = progress.tileMatch.completedLevels.includes(idx + 1);
            return (
              <Button
                key={level.id}
                variant={isCompleted ? "default" : "outline"}
                disabled={!isUnlocked}
                onClick={() => startLevel(idx + 1)}
                className="h-14 relative"
              >
                {isUnlocked ? idx + 1 : '🔒'}
                {isCompleted && <Star className="h-3 w-3 absolute top-1 right-1 text-secondary" />}
              </Button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" size="sm" onClick={() => setShowLevelSelect(true)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Níveis
        </Button>
        <div className="text-center">
          <div className="font-bold">Nível {currentLevel}</div>
          <div className="text-xs text-muted-foreground">{levelData?.name}</div>
        </div>
        <div className="text-right">
          <div className="font-bold text-primary">{score}</div>
          <div className="text-xs text-muted-foreground">Bênçãos</div>
        </div>
      </div>

      {message && (
        <div className="text-center text-lg font-bold text-primary animate-bounce-gentle mb-2">
          {message}
        </div>
      )}

      {/* Game Board */}
      <div className="grid grid-cols-6 gap-1.5 mb-4 min-h-[300px] p-2 bg-muted/30 rounded-xl">
        {tiles.slice(0, 36).map(tile => (
          <button
            key={tile.id}
            onClick={() => handleTileClick(tile)}
            className="aspect-square text-2xl bg-card rounded-xl border-2 border-border hover:border-primary hover:scale-110 transition-all shadow-md active:scale-95 animate-fade-in"
          >
            {tile.type.icon}
          </button>
        ))}
        {tiles.length === 0 && (
          <div className="col-span-6 flex items-center justify-center text-muted-foreground py-8">
            Carregando...
          </div>
        )}
      </div>

      {/* Selected Tiles Bar */}
      <Card className="p-2 mb-4">
        <div className="flex gap-1 min-h-[50px] justify-center">
          {Array(7).fill(null).map((_, idx) => (
            <div
              key={idx}
              className={`w-10 h-10 rounded border-2 flex items-center justify-center text-xl
                ${selectedTiles[idx] ? 'border-primary bg-primary/10' : 'border-dashed border-muted'}`}
            >
              {selectedTiles[idx]?.type.icon}
            </div>
          ))}
        </div>
      </Card>

      {/* Boosters */}
      <div className="flex justify-center gap-2">
        {BOOSTERS.map(booster => (
          <Button key={booster.id} variant="outline" size="sm" className="gap-1">
            {booster.icon} {booster.name}
          </Button>
        ))}
      </div>

      {/* Game Over / Level Complete Modals */}
      {(gameOver || levelComplete) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 text-center max-w-sm mx-4">
            {levelComplete ? (
              <>
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="text-xl font-bold text-primary mb-2">Vitória em Cristo!</h3>
                <p className="text-muted-foreground mb-4">"{levelData?.verse}"</p>
                <p className="text-xs mb-4">— {levelData?.verseReference}</p>
                <div className="flex justify-center gap-1 mb-4">
                  {[1, 2, 3].map(star => (
                    <Star key={star} className={`h-8 w-8 ${star <= (selectedTiles.length <= 2 ? 3 : selectedTiles.length <= 4 ? 2 : 1) ? 'text-secondary fill-secondary' : 'text-muted'}`} />
                  ))}
                </div>
                <Button onClick={() => { setShowLevelSelect(true); }}>Continuar</Button>
              </>
            ) : (
              <>
                <div className="text-4xl mb-2">🙏</div>
                <h3 className="text-xl font-bold mb-2">Tente novamente com fé!</h3>
                <p className="text-muted-foreground mb-4">A barra ficou cheia sem combinações</p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => setShowLevelSelect(true)}>Voltar</Button>
                  <Button onClick={generateTiles}>Tentar Novamente</Button>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default TileMatchGame;
