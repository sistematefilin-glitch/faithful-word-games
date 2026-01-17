import { Achievement } from '@/types/game';

export const ACHIEVEMENTS: Achievement[] = [
  // General Achievements
  {
    id: 'first_revelation',
    name: 'Primeira Revelação',
    description: 'Complete seu primeiro quebra-cabeça',
    icon: '🌟',
    condition: 'puzzle_completed_1',
    unlocked: false,
  },
  {
    id: 'word_scholar',
    name: 'Estudioso da Palavra',
    description: 'Complete 10 níveis de caça-palavras',
    icon: '📖',
    condition: 'wordsearch_completed_10',
    unlocked: false,
  },
  {
    id: 'genesis_complete',
    name: 'Gênesis Completo',
    description: 'Complete todas as 10 imagens de Gênesis',
    icon: '⚡',
    condition: 'puzzle_genesis_all',
    unlocked: false,
  },
  {
    id: 'old_testament_master',
    name: 'Mestre do Antigo Testamento',
    description: 'Complete todos os 50 quebra-cabeças do AT',
    icon: '🎯',
    condition: 'puzzle_at_all',
    unlocked: false,
  },
  {
    id: 'new_testament_master',
    name: 'Mestre do Novo Testamento',
    description: 'Complete todos os 50 quebra-cabeças do NT',
    icon: '✝️',
    condition: 'puzzle_nt_all',
    unlocked: false,
  },
  {
    id: 'bible_expert',
    name: 'Conhecedor da Bíblia',
    description: 'Complete todos os 100 quebra-cabeças',
    icon: '👑',
    condition: 'puzzle_all_100',
    unlocked: false,
  },
  {
    id: 'perfectionist',
    name: 'Perfeccionista',
    description: 'Obtenha 3 estrelas em todos os 100 puzzles',
    icon: '💎',
    condition: 'puzzle_3stars_all',
    unlocked: false,
  },
  {
    id: 'divine_speed',
    name: 'Velocidade Divina',
    description: 'Complete 10 puzzles em menos de 3 minutos cada',
    icon: '⏱️',
    condition: 'puzzle_fast_10',
    unlocked: false,
  },
  {
    id: 'triple_master',
    name: 'Mestre Triplo',
    description: 'Complete pelo menos 50 níveis em cada jogo',
    icon: '🏆',
    condition: 'all_games_50',
    unlocked: false,
  },
  {
    id: 'bible_marathon',
    name: 'Maratonista Bíblico',
    description: 'Complete 20 níveis em um único dia',
    icon: '📚',
    condition: 'daily_20',
    unlocked: false,
  },
  {
    id: 'word_hunter',
    name: 'Caçador de Palavras',
    description: 'Encontre 1000 palavras no caça-palavras',
    icon: '🔍',
    condition: 'words_found_1000',
    unlocked: false,
  },
  {
    id: 'puzzle_master',
    name: 'Mestre dos Puzzles',
    description: 'Complete todos os 100 quebra-cabeças',
    icon: '🧩',
    condition: 'puzzle_all',
    unlocked: false,
  },
  {
    id: 'faith_champion',
    name: 'Campeão da Fé',
    description: 'Obtenha 3 estrelas em 100 caça-palavras',
    icon: '🎮',
    condition: 'wordsearch_3stars_all',
    unlocked: false,
  },
  {
    id: 'star_collector',
    name: 'Colecionador de Estrelas',
    description: 'Acumule 500 estrelas no total',
    icon: '⭐',
    condition: 'total_stars_500',
    unlocked: false,
  },
  {
    id: 'daily_devotion',
    name: 'Dedicação Diária',
    description: 'Jogue por 30 dias consecutivos',
    icon: '🙏',
    condition: 'consecutive_days_30',
    unlocked: false,
  },
  
  // Tile Match Specific
  {
    id: 'tile_beginner',
    name: 'Primeiros Passos',
    description: 'Complete o primeiro nível do Tile Match',
    icon: '🎮',
    condition: 'tile_level_1',
    unlocked: false,
  },
  {
    id: 'tile_intermediate',
    name: 'Crescendo na Fé',
    description: 'Complete 10 níveis do Tile Match',
    icon: '📈',
    condition: 'tile_level_10',
    unlocked: false,
  },
  {
    id: 'tile_master',
    name: 'Mestre do Match',
    description: 'Complete todos os 20 níveis do Tile Match',
    icon: '🏅',
    condition: 'tile_level_20',
    unlocked: false,
  },
  {
    id: 'blessing_collector',
    name: 'Coletor de Bênçãos',
    description: 'Acumule 10.000 bênçãos no Tile Match',
    icon: '✨',
    condition: 'blessings_10000',
    unlocked: false,
  },
  
  // Word Search Specific
  {
    id: 'word_beginner',
    name: 'Buscador Iniciante',
    description: 'Complete seu primeiro caça-palavras',
    icon: '🔎',
    condition: 'wordsearch_level_1',
    unlocked: false,
  },
  {
    id: 'word_streak',
    name: 'Sequência Divina',
    description: 'Encontre 5 palavras seguidas sem erros',
    icon: '🔥',
    condition: 'word_streak_5',
    unlocked: false,
  },
];

export const checkAchievement = (achievementId: string, progress: any): boolean => {
  const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
  if (!achievement) return false;

  switch (achievement.condition) {
    case 'puzzle_completed_1':
      return (progress.puzzle?.completedPuzzles?.length || 0) >= 1;
    case 'wordsearch_completed_10':
      return (progress.wordSearch?.completedLevels?.length || 0) >= 10;
    case 'puzzle_at_all':
      return (progress.puzzle?.completedPuzzles?.filter((id: number) => id <= 50).length || 0) >= 50;
    case 'puzzle_nt_all':
      return (progress.puzzle?.completedPuzzles?.filter((id: number) => id > 50).length || 0) >= 50;
    case 'puzzle_all_100':
      return (progress.puzzle?.completedPuzzles?.length || 0) >= 100;
    case 'total_stars_500':
      const totalStars = (progress.tileMatch?.totalStars || 0) + 
                        (progress.puzzle?.totalStars || 0) + 
                        (progress.wordSearch?.totalStars || 0);
      return totalStars >= 500;
    case 'consecutive_days_30':
      return (progress.consecutiveDays || 0) >= 30;
    case 'tile_level_1':
      return (progress.tileMatch?.completedLevels?.length || 0) >= 1;
    case 'tile_level_10':
      return (progress.tileMatch?.completedLevels?.length || 0) >= 10;
    case 'tile_level_20':
      return (progress.tileMatch?.completedLevels?.length || 0) >= 20;
    case 'blessings_10000':
      return (progress.tileMatch?.blessings || 0) >= 10000;
    case 'wordsearch_level_1':
      return (progress.wordSearch?.completedLevels?.length || 0) >= 1;
    case 'words_found_1000':
      return (progress.wordSearch?.totalWordsFound || 0) >= 1000;
    default:
      return false;
  }
};
