import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TileMatchGame from '@/components/games/TileMatchGame';
import PuzzleGame from '@/components/games/PuzzleGame';
import WordSearchGame from '@/components/games/WordSearchGame';
import { LogOut, User, Settings, Trophy } from 'lucide-react';

const Index = () => {
  const { user, signOut } = useAuth();
  const { progress } = useGame();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('menu');

  const totalStars = progress.tileMatch.totalStars + progress.puzzle.totalStars + progress.wordSearch.totalStars;

  if (activeTab === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <header className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🕊️</span>
            <span className="font-bold text-primary">Jogos da Fé</span>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">{user.email}</span>
                <Button variant="ghost" size="icon" onClick={signOut}><LogOut className="h-4 w-4" /></Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
                <User className="h-4 w-4 mr-2" /> Entrar
              </Button>
            )}
          </div>
        </header>

        <main className="container max-w-lg mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gradient-divine mb-2">✝️ Bem-vindo(a) ✝️</h1>
            <p className="text-muted-foreground">Escolha um jogo para começar</p>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-1">
                <Trophy className="h-4 w-4 text-secondary" />
                <span className="font-semibold">{totalStars} estrelas</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow glow-primary" onClick={() => setActiveTab('tile')}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🎮</span>
                  <div>
                    <CardTitle>Tile Match Bíblico</CardTitle>
                    <CardDescription>Combine peças com símbolos sagrados</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Nível {progress.tileMatch.currentLevel}/20 • {progress.tileMatch.totalStars} ⭐
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow glow-primary" onClick={() => setActiveTab('puzzle')}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🧩</span>
                  <div>
                    <CardTitle>Quebra-Cabeça Bíblico</CardTitle>
                    <CardDescription>100 imagens sagradas para montar</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {progress.puzzle.completedPuzzles.length}/100 completos • {progress.puzzle.totalStars} ⭐
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow glow-primary" onClick={() => setActiveTab('words')}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🔍</span>
                  <div>
                    <CardTitle>Caça-Palavras Bíblico</CardTitle>
                    <CardDescription>100 níveis com palavras da Bíblia</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {progress.wordSearch.completedLevels.length}/100 completos • {progress.wordSearch.totalStars} ⭐
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground italic">
              "Tudo posso naquele que me fortalece"
              <br />
              <span className="text-xs">Filipenses 4:13</span>
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-screen flex flex-col">
        <TabsList className="w-full rounded-none border-b">
          <TabsTrigger value="menu" className="flex-1">🏠 Menu</TabsTrigger>
          <TabsTrigger value="tile" className="flex-1">🎮 Tile</TabsTrigger>
          <TabsTrigger value="puzzle" className="flex-1">🧩 Puzzle</TabsTrigger>
          <TabsTrigger value="words" className="flex-1">🔍 Palavras</TabsTrigger>
        </TabsList>
        <div className="flex-1 overflow-auto">
          <TabsContent value="tile" className="h-full m-0"><TileMatchGame /></TabsContent>
          <TabsContent value="puzzle" className="h-full m-0"><PuzzleGame /></TabsContent>
          <TabsContent value="words" className="h-full m-0"><WordSearchGame /></TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Index;
