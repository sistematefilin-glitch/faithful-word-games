import { WordSearchLevel } from '@/types/game';

export const WORD_SEARCH_LEVELS: WordSearchLevel[] = [
  // ANTIGO TESTAMENTO - GÊNESIS (1-8)
  { id: 1, title: 'Criação', category: 'Gênesis', testament: 'AT', verseReference: 'Gênesis 1', words: ['DEUS', 'LUZ', 'TERRA', 'CÉU', 'MAR', 'SOL', 'LUA', 'ESTRELA'], gridSize: 8, difficulty: 'fácil' },
  { id: 2, title: 'Adão e Eva', category: 'Gênesis', testament: 'AT', verseReference: 'Gênesis 2-3', words: ['ADÃO', 'EVA', 'ÉDEN', 'JARDIM', 'SERPENTE', 'FRUTO', 'ÁRVORE'], gridSize: 8, difficulty: 'fácil' },
  { id: 3, title: 'Caim e Abel', category: 'Gênesis', testament: 'AT', verseReference: 'Gênesis 4', words: ['CAIM', 'ABEL', 'OFERTA', 'IRMÃO', 'SANGUE', 'MARCA'], gridSize: 8, difficulty: 'fácil' },
  { id: 4, title: 'Noé', category: 'Gênesis', testament: 'AT', verseReference: 'Gênesis 6-9', words: ['NOÉ', 'ARCA', 'DILÚVIO', 'POMBA', 'ALIANÇA', 'MONTE'], gridSize: 8, difficulty: 'fácil' },
  { id: 5, title: 'Abraão', category: 'Gênesis', testament: 'AT', verseReference: 'Gênesis 12-22', words: ['ABRAÃO', 'SARA', 'ISAQUE', 'FÉ', 'PROMESSA', 'ALTAR'], gridSize: 8, difficulty: 'fácil' },
  { id: 6, title: 'Isaque', category: 'Gênesis', testament: 'AT', verseReference: 'Gênesis 24-27', words: ['ISAQUE', 'REBECA', 'ESAÚ', 'JACÓ', 'BÊNÇÃO', 'POÇO'], gridSize: 8, difficulty: 'fácil' },
  { id: 7, title: 'Jacó', category: 'Gênesis', testament: 'AT', verseReference: 'Gênesis 28-35', words: ['JACÓ', 'RAQUEL', 'ISRAEL', 'ESCADA', 'ANJOS', 'LUTA'], gridSize: 8, difficulty: 'fácil' },
  { id: 8, title: 'José', category: 'Gênesis', testament: 'AT', verseReference: 'Gênesis 37-50', words: ['JOSÉ', 'SONHOS', 'TÚNICA', 'POÇO', 'EGITO', 'FARAÓ', 'TRIGO'], gridSize: 8, difficulty: 'fácil' },
  
  // ÊXODO (9-16)
  { id: 9, title: 'Moisés Bebê', category: 'Êxodo', testament: 'AT', verseReference: 'Êxodo 2', words: ['MOISÉS', 'CESTO', 'NILO', 'PRINCESA', 'FILHA', 'FARAÓ'], gridSize: 8, difficulty: 'fácil' },
  { id: 10, title: 'Sarça Ardente', category: 'Êxodo', testament: 'AT', verseReference: 'Êxodo 3', words: ['SARÇA', 'FOGO', 'TERRA', 'SANTA', 'VOZ', 'MONTE'], gridSize: 8, difficulty: 'fácil' },
  { id: 11, title: 'Pragas', category: 'Êxodo', testament: 'AT', verseReference: 'Êxodo 7-11', words: ['PRAGAS', 'SANGUE', 'RÃS', 'MOSCAS', 'GADO', 'TREVAS', 'GAFANHOTOS'], gridSize: 8, difficulty: 'fácil' },
  { id: 12, title: 'Páscoa', category: 'Êxodo', testament: 'AT', verseReference: 'Êxodo 12', words: ['PÁSCOA', 'CORDEIRO', 'SANGUE', 'PORTA', 'NOITE', 'ANJO'], gridSize: 8, difficulty: 'fácil' },
  { id: 13, title: 'Mar Vermelho', category: 'Êxodo', testament: 'AT', verseReference: 'Êxodo 14', words: ['MAR', 'VERMELHO', 'ÁGUAS', 'PAREDE', 'SECO', 'MOISÉS'], gridSize: 8, difficulty: 'fácil' },
  { id: 14, title: 'Maná', category: 'Êxodo', testament: 'AT', verseReference: 'Êxodo 16', words: ['MANÁ', 'CÉU', 'PÃO', 'DESERTO', 'FOME', 'MANHÃ'], gridSize: 8, difficulty: 'fácil' },
  { id: 15, title: 'Dez Mandamentos', category: 'Êxodo', testament: 'AT', verseReference: 'Êxodo 20', words: ['TÁBUAS', 'PEDRA', 'SINAI', 'LEI', 'MOISÉS', 'MONTE', 'DEUS'], gridSize: 8, difficulty: 'fácil' },
  { id: 16, title: 'Tabernáculo', category: 'Êxodo', testament: 'AT', verseReference: 'Êxodo 25-40', words: ['ARCA', 'TENDA', 'OURO', 'SANTO', 'VÉU', 'ALTAR'], gridSize: 8, difficulty: 'fácil' },
  
  // NÚMEROS E DEUTERONÔMIO (17-20)
  { id: 17, title: 'Espias', category: 'Números', testament: 'AT', verseReference: 'Números 13', words: ['ESPIAS', 'CANAÃ', 'UVA', 'GIGANTES', 'CALEBE', 'JOSUÉ', 'FÉ'], gridSize: 8, difficulty: 'fácil' },
  { id: 18, title: 'Serpente Bronze', category: 'Números', testament: 'AT', verseReference: 'Números 21', words: ['SERPENTE', 'BRONZE', 'PICADA', 'CURA', 'OLHAR', 'POSTE'], gridSize: 8, difficulty: 'fácil' },
  { id: 19, title: 'Balaão', category: 'Números', testament: 'AT', verseReference: 'Números 22', words: ['BALAÃO', 'JUMENTA', 'ANJO', 'PROFETA', 'MOABE', 'ESPADA'], gridSize: 8, difficulty: 'fácil' },
  { id: 20, title: 'Promessa', category: 'Deuteronômio', testament: 'AT', verseReference: 'Deuteronômio 34', words: ['PROMESSA', 'TERRA', 'LEITE', 'MEL', 'CANAÃ', 'MOISÉS'], gridSize: 8, difficulty: 'fácil' },
  
  // JOSUÉ E JUÍZES (21-28)
  { id: 21, title: 'Jericó', category: 'Josué', testament: 'AT', verseReference: 'Josué 6', words: ['JERICÓ', 'MURALHAS', 'TROMBETAS', 'JOSUÉ', 'SETE', 'VOLTA', 'GRITO'], gridSize: 10, difficulty: 'médio' },
  { id: 22, title: 'Sol Parado', category: 'Josué', testament: 'AT', verseReference: 'Josué 10', words: ['SOL', 'LUA', 'PAROU', 'DIA', 'GIBEOM', 'BATALHA', 'JOSUÉ', 'ORAÇÃO'], gridSize: 10, difficulty: 'médio' },
  { id: 23, title: 'Débora', category: 'Juízes', testament: 'AT', verseReference: 'Juízes 4-5', words: ['DÉBORA', 'JUÍZA', 'PROFETISA', 'BARAQUE', 'SÍSERA', 'VITÓRIA', 'CÂNTICO'], gridSize: 10, difficulty: 'médio' },
  { id: 24, title: 'Gideão', category: 'Juízes', testament: 'AT', verseReference: 'Juízes 6-7', words: ['GIDEÃO', 'ORVALHO', 'TROMBETAS', 'CÂNTAROS', 'LUZ', 'TREZENTOS', 'MIDIANITAS'], gridSize: 10, difficulty: 'médio' },
  { id: 25, title: 'Sansão Nascimento', category: 'Juízes', testament: 'AT', verseReference: 'Juízes 13', words: ['SANSÃO', 'NAZIREU', 'ANJO', 'FORÇA', 'MANOÁ', 'PROMESSA', 'CABELO'], gridSize: 10, difficulty: 'médio' },
  { id: 26, title: 'Sansão e Dalila', category: 'Juízes', testament: 'AT', verseReference: 'Juízes 16', words: ['SANSÃO', 'DALILA', 'CABELO', 'TRANÇAS', 'FORÇA', 'TRAIÇÃO', 'PRATA'], gridSize: 10, difficulty: 'médio' },
  { id: 27, title: 'Templo Destruído', category: 'Juízes', testament: 'AT', verseReference: 'Juízes 16', words: ['TEMPLO', 'COLUNAS', 'FILISTEUS', 'FORÇA', 'MORTE', 'DAGON', 'ORAÇÃO'], gridSize: 10, difficulty: 'médio' },
  { id: 28, title: 'Rute', category: 'Rute', testament: 'AT', verseReference: 'Rute 1-4', words: ['RUTE', 'NOEMI', 'BOAZ', 'MOABE', 'ESPIGAS', 'PARENTE', 'AMOR', 'FIDELIDADE'], gridSize: 10, difficulty: 'médio' },
  
  // SAMUEL E REIS (29-40)
  { id: 29, title: 'Samuel Criança', category: 'Samuel', testament: 'AT', verseReference: '1 Samuel 3', words: ['SAMUEL', 'ANA', 'ELI', 'TEMPLO', 'VOZ', 'CHAMADO', 'SERVO', 'OUVIR'], gridSize: 10, difficulty: 'médio' },
  { id: 30, title: 'Saul Ungido', category: 'Samuel', testament: 'AT', verseReference: '1 Samuel 10', words: ['SAUL', 'SAMUEL', 'ÓLEO', 'REI', 'UNGIDO', 'ISRAEL', 'BENJAMIM'], gridSize: 10, difficulty: 'médio' },
  { id: 31, title: 'Davi Ungido', category: 'Samuel', testament: 'AT', verseReference: '1 Samuel 16', words: ['DAVI', 'JESSÉ', 'ÓLEO', 'PASTOR', 'ESCOLHIDO', 'CORAÇÃO', 'OVELHAS'], gridSize: 10, difficulty: 'médio' },
  { id: 32, title: 'Davi e Golias', category: 'Samuel', testament: 'AT', verseReference: '1 Samuel 17', words: ['DAVI', 'GOLIAS', 'FUNDA', 'PEDRAS', 'GIGANTE', 'FILISTEU', 'SENHOR', 'VITÓRIA'], gridSize: 10, difficulty: 'médio' },
  { id: 33, title: 'Davi e Jônatas', category: 'Samuel', testament: 'AT', verseReference: '1 Samuel 18-20', words: ['DAVI', 'JÔNATAS', 'AMIZADE', 'ALIANÇA', 'FLECHA', 'AMOR', 'FIDELIDADE'], gridSize: 10, difficulty: 'médio' },
  { id: 34, title: 'Davi Rei', category: 'Samuel', testament: 'AT', verseReference: '2 Samuel 5', words: ['DAVI', 'REI', 'JERUSALÉM', 'ARCA', 'HARPA', 'SALMOS', 'TRONO', 'JUDÁ'], gridSize: 10, difficulty: 'médio' },
  { id: 35, title: 'Salomão Sabedoria', category: 'Reis', testament: 'AT', verseReference: '1 Reis 3', words: ['SALOMÃO', 'SABEDORIA', 'SONHO', 'PEDIDO', 'JUSTIÇA', 'CORAÇÃO', 'DEUS'], gridSize: 10, difficulty: 'médio' },
  { id: 36, title: 'Julgamento', category: 'Reis', testament: 'AT', verseReference: '1 Reis 3', words: ['JULGAMENTO', 'BEBÊ', 'MÃES', 'ESPADA', 'SALOMÃO', 'VERDADE', 'AMOR'], gridSize: 10, difficulty: 'médio' },
  { id: 37, title: 'Templo', category: 'Reis', testament: 'AT', verseReference: '1 Reis 6-8', words: ['TEMPLO', 'SALOMÃO', 'OURO', 'CEDRO', 'GLÓRIA', 'NUVEM', 'ORAÇÃO'], gridSize: 10, difficulty: 'médio' },
  { id: 38, title: 'Rainha Sabá', category: 'Reis', testament: 'AT', verseReference: '1 Reis 10', words: ['SABÁ', 'RAINHA', 'VISITA', 'RIQUEZA', 'PERGUNTAS', 'SALOMÃO', 'OURO'], gridSize: 10, difficulty: 'médio' },
  { id: 39, title: 'Divisão Reino', category: 'Reis', testament: 'AT', verseReference: '1 Reis 12', words: ['REINO', 'DIVIDIDO', 'ROBOÃO', 'JEROBOÃO', 'TRIBOS', 'ISRAEL', 'JUDÁ'], gridSize: 10, difficulty: 'médio' },
  { id: 40, title: 'Elias Corvo', category: 'Reis', testament: 'AT', verseReference: '1 Reis 17', words: ['ELIAS', 'CORVO', 'QUERITE', 'PÃO', 'CARNE', 'RIBEIRO', 'ÁGUA', 'DEUS'], gridSize: 10, difficulty: 'médio' },
  
  // PROFETAS (41-50)
  { id: 41, title: 'Elias e Profetas', category: 'Profetas', testament: 'AT', verseReference: '1 Reis 18', words: ['ELIAS', 'BAAL', 'FOGO', 'ALTAR', 'ÁGUA', 'CARMELO', 'PROFETAS', 'SENHOR'], gridSize: 10, difficulty: 'médio' },
  { id: 42, title: 'Elias Céu', category: 'Profetas', testament: 'AT', verseReference: '2 Reis 2', words: ['ELIAS', 'CÉUS', 'CARROS', 'FOGO', 'ELISEU', 'MANTO', 'JORDÃO', 'ESPÍRITO'], gridSize: 10, difficulty: 'médio' },
  { id: 43, title: 'Eliseu Milagres', category: 'Profetas', testament: 'AT', verseReference: '2 Reis 4-6', words: ['ELISEU', 'AZEITE', 'VIÚVA', 'MACHADO', 'FERRO', 'MILAGRE', 'PROFETA'], gridSize: 10, difficulty: 'médio' },
  { id: 44, title: 'Naamã', category: 'Profetas', testament: 'AT', verseReference: '2 Reis 5', words: ['NAAMÃ', 'LEPRA', 'JORDÃO', 'SETE', 'MERGULHO', 'CURA', 'ELISEU', 'SÍRIA'], gridSize: 10, difficulty: 'médio' },
  { id: 45, title: 'Jonas Fuga', category: 'Profetas', testament: 'AT', verseReference: 'Jonas 1', words: ['JONAS', 'NÍNIVE', 'NAVIO', 'TARSIS', 'FUGA', 'TEMPESTADE', 'MAR', 'SORTE'], gridSize: 10, difficulty: 'médio' },
  { id: 46, title: 'Jonas Baleia', category: 'Profetas', testament: 'AT', verseReference: 'Jonas 2', words: ['JONAS', 'BALEIA', 'TRÊS', 'DIAS', 'VENTRE', 'ORAÇÃO', 'PEIXE', 'TERRA'], gridSize: 10, difficulty: 'médio' },
  { id: 47, title: 'Jonas Pregação', category: 'Profetas', testament: 'AT', verseReference: 'Jonas 3', words: ['JONAS', 'NÍNIVE', 'CIDADE', 'PERDÃO', 'REI', 'POVO', 'DEUS'], gridSize: 10, difficulty: 'médio' },
  { id: 48, title: 'Daniel Leões', category: 'Profetas', testament: 'AT', verseReference: 'Daniel 6', words: ['DANIEL', 'LEÕES', 'COVA', 'ANJO', 'FÉ', 'ORAÇÃO', 'BOCA', 'REI', 'DARIO'], gridSize: 10, difficulty: 'médio' },
  { id: 49, title: 'Fornalha', category: 'Profetas', testament: 'AT', verseReference: 'Daniel 3', words: ['FORNALHA', 'FOGO', 'TRÊS', 'JOVENS', 'QUARTO', 'ANJO', 'SADRAQUE', 'MESAQUE'], gridSize: 10, difficulty: 'médio' },
  { id: 50, title: 'Ezequiel Ossos', category: 'Profetas', testament: 'AT', verseReference: 'Ezequiel 37', words: ['EZEQUIEL', 'VALE', 'OSSOS', 'SECOS', 'VIDA', 'ESPÍRITO', 'PROFECIA', 'ISRAEL'], gridSize: 10, difficulty: 'médio' },
  
  // NOVO TESTAMENTO - NASCIMENTO DE JESUS (51-58)
  { id: 51, title: 'Anunciação', category: 'Nascimento', testament: 'NT', verseReference: 'Lucas 1:26-38', words: ['GABRIEL', 'MARIA', 'ANJO', 'GRAÇA', 'ESPÍRITO', 'FILHO', 'SANTA', 'JESUS'], gridSize: 12, difficulty: 'difícil' },
  { id: 52, title: 'Visitação', category: 'Nascimento', testament: 'NT', verseReference: 'Lucas 1:39-56', words: ['MARIA', 'ISABEL', 'PRIMA', 'SALTO', 'VENTRE', 'BENDITA', 'CÂNTICO', 'ALEGRIA'], gridSize: 12, difficulty: 'difícil' },
  { id: 53, title: 'José Sonho', category: 'Nascimento', testament: 'NT', verseReference: 'Mateus 1:18-25', words: ['JOSÉ', 'SONHO', 'ANJO', 'MARIA', 'MEDO', 'ESPÍRITO', 'EMANUEL', 'SALVADOR'], gridSize: 12, difficulty: 'difícil' },
  { id: 54, title: 'Belém', category: 'Nascimento', testament: 'NT', verseReference: 'Lucas 2:1-7', words: ['BELÉM', 'MANJEDOURA', 'PANOS', 'ESTREBARIA', 'CÉSAR', 'NAZARÉ', 'MENINO', 'JOSÉ'], gridSize: 12, difficulty: 'difícil' },
  { id: 55, title: 'Pastores', category: 'Nascimento', testament: 'NT', verseReference: 'Lucas 2:8-20', words: ['PASTORES', 'ANJOS', 'GLÓRIA', 'CAMPO', 'REBANHO', 'ESTRELA', 'NOITE', 'PAZ'], gridSize: 12, difficulty: 'difícil' },
  { id: 56, title: 'Reis Magos', category: 'Nascimento', testament: 'NT', verseReference: 'Mateus 2:1-12', words: ['MAGOS', 'ESTRELA', 'ORIENTE', 'OURO', 'INCENSO', 'MIRRA', 'HERODES', 'PRESENTES'], gridSize: 12, difficulty: 'difícil' },
  { id: 57, title: 'Apresentação', category: 'Nascimento', testament: 'NT', verseReference: 'Lucas 2:22-38', words: ['SIMEÃO', 'ANA', 'TEMPLO', 'LUZ', 'ISRAEL', 'ESPERA', 'SALVAÇÃO', 'PROFECIA'], gridSize: 12, difficulty: 'difícil' },
  { id: 58, title: 'Fuga Egito', category: 'Nascimento', testament: 'NT', verseReference: 'Mateus 2:13-23', words: ['FUGA', 'EGITO', 'HERODES', 'MENINOS', 'ANJO', 'SONHO', 'JOSÉ', 'NAZARÉ'], gridSize: 12, difficulty: 'difícil' },
  
  // INFÂNCIA E PREPARAÇÃO (59-63)
  { id: 59, title: 'Jesus Templo', category: 'Infância', testament: 'NT', verseReference: 'Lucas 2:41-52', words: ['JESUS', 'DOZE', 'ANOS', 'TEMPLO', 'DOUTORES', 'PAI', 'SABEDORIA', 'PÁSCOA'], gridSize: 12, difficulty: 'difícil' },
  { id: 60, title: 'João Batista', category: 'Preparação', testament: 'NT', verseReference: 'Mateus 3:1-12', words: ['JOÃO', 'BATISTA', 'DESERTO', 'GAFANHOTOS', 'MEL', 'CAMELO', 'BATISMO', 'JORDÃO'], gridSize: 12, difficulty: 'difícil' },
  { id: 61, title: 'Batismo', category: 'Preparação', testament: 'NT', verseReference: 'Mateus 3:13-17', words: ['BATISMO', 'JORDÃO', 'ESPÍRITO', 'POMBA', 'VOZ', 'FILHO', 'AMADO', 'CÉUS'], gridSize: 12, difficulty: 'difícil' },
  { id: 62, title: 'Tentação', category: 'Preparação', testament: 'NT', verseReference: 'Mateus 4:1-11', words: ['TENTAÇÃO', 'DESERTO', 'JEJUM', 'DIABO', 'PEDRAS', 'PÃO', 'ANJOS', 'QUARENTA'], gridSize: 12, difficulty: 'difícil' },
  { id: 63, title: 'Primeiros', category: 'Preparação', testament: 'NT', verseReference: 'João 1:35-51', words: ['DISCÍPULOS', 'ANDRÉ', 'PEDRO', 'JOÃO', 'TIAGO', 'SEGUIR', 'MESTRE', 'CORDEIRO'], gridSize: 12, difficulty: 'difícil' },
  
  // MINISTÉRIO E MILAGRES (64-80)
  { id: 64, title: 'Bodas Caná', category: 'Milagres', testament: 'NT', verseReference: 'João 2:1-11', words: ['BODAS', 'CANÁ', 'VINHO', 'ÁGUA', 'TALHAS', 'MARIA', 'MILAGRE', 'SERVO'], gridSize: 12, difficulty: 'difícil' },
  { id: 65, title: 'Nicodemos', category: 'Ministério', testament: 'NT', verseReference: 'João 3:1-21', words: ['NICODEMOS', 'NOITE', 'NASCER', 'NOVO', 'ÁGUA', 'ESPÍRITO', 'AMOR', 'LUZ'], gridSize: 12, difficulty: 'difícil' },
  { id: 66, title: 'Samaritana', category: 'Ministério', testament: 'NT', verseReference: 'João 4:1-42', words: ['SAMARITANA', 'POÇO', 'ÁGUA', 'VIVA', 'ADORAÇÃO', 'ESPÍRITO', 'VERDADE', 'MESSIAS'], gridSize: 12, difficulty: 'difícil' },
  { id: 67, title: 'Pesca', category: 'Milagres', testament: 'NT', verseReference: 'Lucas 5:1-11', words: ['PESCA', 'REDES', 'BARCOS', 'CHEIOS', 'PEDRO', 'JOELHOS', 'PESCADOR', 'HOMENS'], gridSize: 12, difficulty: 'difícil' },
  { id: 68, title: 'Paralítico', category: 'Milagres', testament: 'NT', verseReference: 'Marcos 2:1-12', words: ['PARALÍTICO', 'TELHADO', 'LEITO', 'PECADOS', 'LEVANTA', 'ANDA', 'FÉ', 'AMIGOS'], gridSize: 12, difficulty: 'difícil' },
  { id: 69, title: 'Mão Seca', category: 'Milagres', testament: 'NT', verseReference: 'Marcos 3:1-6', words: ['MÃO', 'SECA', 'SÁBADO', 'ESTENDE', 'HOMEM', 'CURA', 'SINAGOGA', 'FARISEUS'], gridSize: 12, difficulty: 'difícil' },
  { id: 70, title: 'Leproso', category: 'Milagres', testament: 'NT', verseReference: 'Marcos 1:40-45', words: ['LEPROSO', 'PURO', 'QUERO', 'TOCA', 'LIMPO', 'SACERDOTE', 'JESUS', 'FÉ'], gridSize: 12, difficulty: 'difícil' },
  { id: 71, title: 'Centurião', category: 'Milagres', testament: 'NT', verseReference: 'Mateus 8:5-13', words: ['CENTURIÃO', 'SERVO', 'PALAVRA', 'FÉ', 'ISRAEL', 'AUTORIDADE', 'CURADO', 'ROMA'], gridSize: 12, difficulty: 'difícil' },
  { id: 72, title: 'Viúva Naim', category: 'Milagres', testament: 'NT', verseReference: 'Lucas 7:11-17', words: ['VIÚVA', 'NAIM', 'FILHO', 'ÚNICO', 'CHORA', 'LEVANTA', 'PROFETA', 'COMPAIXÃO'], gridSize: 12, difficulty: 'difícil' },
  { id: 73, title: 'Tempestade', category: 'Milagres', testament: 'NT', verseReference: 'Marcos 4:35-41', words: ['TEMPESTADE', 'MAR', 'BARCO', 'DORME', 'MEDO', 'ACALMA', 'VENTO', 'ONDAS'], gridSize: 12, difficulty: 'difícil' },
  { id: 74, title: 'Endemoninhado', category: 'Milagres', testament: 'NT', verseReference: 'Marcos 5:1-20', words: ['GADARENO', 'LEGIÃO', 'PORCOS', 'DEMÔNIOS', 'CADEIA', 'JESUS', 'LIVRE', 'ANUNCIA'], gridSize: 12, difficulty: 'difícil' },
  { id: 75, title: 'Jairo', category: 'Milagres', testament: 'NT', verseReference: 'Marcos 5:21-43', words: ['JAIRO', 'FILHA', 'DOZE', 'ANOS', 'DORME', 'LEVANTA', 'TALITA', 'CUMI'], gridSize: 12, difficulty: 'difícil' },
  { id: 76, title: 'Hemorroíssa', category: 'Milagres', testament: 'NT', verseReference: 'Marcos 5:25-34', words: ['HEMORROÍSSA', 'DOZE', 'ANOS', 'VESTE', 'TOCA', 'FÉ', 'CURADA', 'PODER'], gridSize: 12, difficulty: 'difícil' },
  { id: 77, title: 'Multiplicação', category: 'Milagres', testament: 'NT', verseReference: 'Mateus 14:13-21', words: ['CINCO', 'PÃES', 'DOIS', 'PEIXES', 'CESTOS', 'MILHARES', 'MILAGRE', 'GRAÇAS'], gridSize: 12, difficulty: 'difícil' },
  { id: 78, title: 'Andar Águas', category: 'Milagres', testament: 'NT', verseReference: 'Mateus 14:22-33', words: ['PEDRO', 'ÁGUAS', 'ANDA', 'MEDO', 'AFUNDA', 'MÃO', 'FÉ', 'VENTO'], gridSize: 12, difficulty: 'difícil' },
  { id: 79, title: 'Transfiguração', category: 'Milagres', testament: 'NT', verseReference: 'Mateus 17:1-9', words: ['MONTE', 'MOISÉS', 'ELIAS', 'BRANCO', 'VOZ', 'NUVEM', 'PEDRO', 'GLÓRIA'], gridSize: 12, difficulty: 'difícil' },
  { id: 80, title: 'Lázaro', category: 'Milagres', testament: 'NT', verseReference: 'João 11:1-44', words: ['LÁZARO', 'QUATRO', 'DIAS', 'TÚMULO', 'CHORA', 'FORA', 'MARTA', 'MARIA'], gridSize: 12, difficulty: 'difícil' },
  
  // PARÁBOLAS (81-88)
  { id: 81, title: 'Semeador', category: 'Parábolas', testament: 'NT', verseReference: 'Mateus 13:1-23', words: ['SEMEADOR', 'SEMENTES', 'CAMINHO', 'PEDRAS', 'ESPINHOS', 'BOA', 'TERRA', 'FRUTO', 'PALAVRA'], gridSize: 15, difficulty: 'expert' },
  { id: 82, title: 'Joio Trigo', category: 'Parábolas', testament: 'NT', verseReference: 'Mateus 13:24-30', words: ['JOIO', 'TRIGO', 'INIMIGO', 'CAMPO', 'CEIFA', 'SEPARAR', 'ANJOS', 'FOGO', 'CELEIRO'], gridSize: 15, difficulty: 'expert' },
  { id: 83, title: 'Grão Mostarda', category: 'Parábolas', testament: 'NT', verseReference: 'Mateus 13:31-32', words: ['MOSTARDA', 'GRÃO', 'MENOR', 'ÁRVORE', 'MAIOR', 'AVES', 'REINO', 'CÉUS', 'CRESCE'], gridSize: 15, difficulty: 'expert' },
  { id: 84, title: 'Fermento', category: 'Parábolas', testament: 'NT', verseReference: 'Mateus 13:33', words: ['FERMENTO', 'MASSA', 'FARINHA', 'REINO', 'LEVEDA', 'TRÊS', 'MULHER', 'ESCONDEU', 'CRESCE'], gridSize: 15, difficulty: 'expert' },
  { id: 85, title: 'Tesouro', category: 'Parábolas', testament: 'NT', verseReference: 'Mateus 13:44', words: ['TESOURO', 'CAMPO', 'ESCONDIDO', 'VENDE', 'COMPRA', 'ALEGRIA', 'REINO', 'TUDO', 'HOMEM'], gridSize: 15, difficulty: 'expert' },
  { id: 86, title: 'Pérola', category: 'Parábolas', testament: 'NT', verseReference: 'Mateus 13:45-46', words: ['PÉROLA', 'MERCADOR', 'GRANDE', 'PREÇO', 'VENDE', 'TUDO', 'COMPRA', 'VALOR', 'REINO'], gridSize: 15, difficulty: 'expert' },
  { id: 87, title: 'Filho Pródigo', category: 'Parábolas', testament: 'NT', verseReference: 'Lucas 15:11-32', words: ['FILHO', 'PRÓDIGO', 'HERANÇA', 'PORCOS', 'VOLTA', 'ABRAÇO', 'PAI', 'ANEL', 'FESTA', 'IRMÃO'], gridSize: 15, difficulty: 'expert' },
  { id: 88, title: 'Bom Samaritano', category: 'Parábolas', testament: 'NT', verseReference: 'Lucas 10:25-37', words: ['SAMARITANO', 'FERIDO', 'SACERDOTE', 'LEVITA', 'PRÓXIMO', 'AZEITE', 'VINHO', 'ESTALAGEM', 'AMOR', 'CUIDA'], gridSize: 15, difficulty: 'expert' },
  
  // PAIXÃO E RESSURREIÇÃO (89-98)
  { id: 89, title: 'Entrada', category: 'Paixão', testament: 'NT', verseReference: 'Mateus 21:1-11', words: ['ENTRADA', 'JUMENTO', 'RAMOS', 'HOSANA', 'FILHO', 'DAVI', 'JERUSALÉM', 'MANTOS', 'REI', 'MULTIDÃO'], gridSize: 15, difficulty: 'expert' },
  { id: 90, title: 'Última Ceia', category: 'Paixão', testament: 'NT', verseReference: 'Lucas 22:7-23', words: ['CEIA', 'PÃO', 'VINHO', 'CORPO', 'SANGUE', 'MEMORIAL', 'DOZE', 'TRAIDOR', 'ALIANÇA', 'PÁSCOA'], gridSize: 15, difficulty: 'expert' },
  { id: 91, title: 'Lava-pés', category: 'Paixão', testament: 'NT', verseReference: 'João 13:1-17', words: ['LAVA', 'PÉS', 'TOALHA', 'SERVO', 'PEDRO', 'EXEMPLO', 'BACIA', 'MESTRE', 'AMOR', 'HUMILDADE'], gridSize: 15, difficulty: 'expert' },
  { id: 92, title: 'Getsêmani', category: 'Paixão', testament: 'NT', verseReference: 'Mateus 26:36-46', words: ['GETSÊMANI', 'ANGÚSTIA', 'CÁLICE', 'SUOR', 'SANGUE', 'TRÊS', 'ORAÇÃO', 'VIGIAI', 'VONTADE', 'ANJO'], gridSize: 15, difficulty: 'expert' },
  { id: 93, title: 'Traição', category: 'Paixão', testament: 'NT', verseReference: 'Mateus 26:47-56', words: ['JUDAS', 'BEIJO', 'TRAIÇÃO', 'PRATA', 'TRINTA', 'ORELHA', 'SOLDADOS', 'ESPADA', 'PRISÃO', 'ESCRITURAS'], gridSize: 15, difficulty: 'expert' },
  { id: 94, title: 'Julgamento', category: 'Paixão', testament: 'NT', verseReference: 'Mateus 27:11-26', words: ['PILATOS', 'BARRABÁS', 'COROA', 'ESPINHOS', 'PÚRPURA', 'AÇOITES', 'CRUZ', 'MÃOS', 'LAVOU', 'REI'], gridSize: 15, difficulty: 'expert' },
  { id: 95, title: 'Crucificação', category: 'Paixão', testament: 'NT', verseReference: 'João 19:16-30', words: ['CRUZ', 'GÓLGOTA', 'PREGOS', 'VINAGRE', 'LADRÃO', 'CONSUMADO', 'TREVAS', 'VÉU', 'TERRA', 'MARIA'], gridSize: 15, difficulty: 'expert' },
  { id: 96, title: 'Ressurreição', category: 'Ressurreição', testament: 'NT', verseReference: 'Mateus 28:1-10', words: ['TÚMULO', 'VAZIO', 'ANJO', 'PEDRA', 'TERCEIRO', 'MULHERES', 'GUARDAS', 'MEDO', 'ALEGRIA', 'GALILEA'], gridSize: 15, difficulty: 'expert' },
  { id: 97, title: 'Emaús', category: 'Ressurreição', testament: 'NT', verseReference: 'Lucas 24:13-35', words: ['EMAÚS', 'CAMINHO', 'DOIS', 'PARTIR', 'PÃO', 'RECONHECER', 'ESCRITURAS', 'CORAÇÃO', 'ARDIA', 'VOLTA'], gridSize: 15, difficulty: 'expert' },
  { id: 98, title: 'Tomé', category: 'Ressurreição', testament: 'NT', verseReference: 'João 20:24-29', words: ['TOMÉ', 'DEDOS', 'MÃOS', 'LADO', 'CRÊ', 'SENHOR', 'DEUS', 'OITO', 'DIAS', 'VER'], gridSize: 15, difficulty: 'expert' },
  
  // ATOS E IGREJA (99-100)
  { id: 99, title: 'Pentecostes', category: 'Atos', testament: 'NT', verseReference: 'Atos 2:1-13', words: ['PENTECOSTES', 'LÍNGUAS', 'FOGO', 'ESPÍRITO', 'VENTO', 'PODER', 'NAÇÕES', 'PEDRO', 'PREGAÇÃO', 'BATISMO', 'TRÊS', 'MIL'], gridSize: 15, difficulty: 'expert' },
  { id: 100, title: 'Ascensão', category: 'Atos', testament: 'NT', verseReference: 'Atos 1:6-11', words: ['ASCENSÃO', 'NUVEM', 'MONTE', 'OLIVEIRAS', 'DOIS', 'HOMENS', 'VOLTARÁ', 'ESPÍRITO', 'TESTEMUNHAS', 'PODER', 'JERUSALÉM', 'JUDEIA'], gridSize: 15, difficulty: 'expert' },
];

export const getWordSearchByTestament = (testament: 'AT' | 'NT') => 
  WORD_SEARCH_LEVELS.filter(l => l.testament === testament);

export const getWordSearchByCategory = (category: string) => 
  WORD_SEARCH_LEVELS.filter(l => l.category === category);

export const getWordSearchCategories = () => {
  const categories = new Set(WORD_SEARCH_LEVELS.map(l => l.category));
  return Array.from(categories);
};
