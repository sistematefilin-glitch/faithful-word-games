import { PuzzleImage } from '@/types/game';

export const PUZZLE_IMAGES: PuzzleImage[] = [
  // ANTIGO TESTAMENTO - GÊNESIS (1-10)
  { id: 1, title: 'A Criação do Mundo', category: 'Gênesis', testament: 'AT', verse: 'No princípio criou Deus os céus e a terra.', verseReference: 'Gênesis 1:1', imageUrl: '', difficulty: 'fácil' },
  { id: 2, title: 'Adão no Jardim do Éden', category: 'Gênesis', testament: 'AT', verse: 'E formou o Senhor Deus o homem do pó da terra.', verseReference: 'Gênesis 2:7', imageUrl: '', difficulty: 'fácil' },
  { id: 3, title: 'Eva e a Serpente', category: 'Gênesis', testament: 'AT', verse: 'A serpente era mais astuta que todos os animais.', verseReference: 'Gênesis 3:1', imageUrl: '', difficulty: 'fácil' },
  { id: 4, title: 'O Jardim do Éden', category: 'Gênesis', testament: 'AT', verse: 'E plantou o Senhor Deus um jardim no Éden.', verseReference: 'Gênesis 2:8', imageUrl: '', difficulty: 'fácil' },
  { id: 5, title: 'Caim e Abel', category: 'Gênesis', testament: 'AT', verse: 'E Abel também trouxe dos primogênitos das ovelhas.', verseReference: 'Gênesis 4:4', imageUrl: '', difficulty: 'fácil' },
  { id: 6, title: 'A Arca de Noé', category: 'Gênesis', testament: 'AT', verse: 'Faze uma arca de madeira de gofer.', verseReference: 'Gênesis 6:14', imageUrl: '', difficulty: 'fácil' },
  { id: 7, title: 'O Dilúvio', category: 'Gênesis', testament: 'AT', verse: 'E veio o dilúvio sobre a terra.', verseReference: 'Gênesis 7:17', imageUrl: '', difficulty: 'fácil' },
  { id: 8, title: 'O Arco-Íris da Aliança', category: 'Gênesis', testament: 'AT', verse: 'Porei o meu arco nas nuvens.', verseReference: 'Gênesis 9:13', imageUrl: '', difficulty: 'fácil' },
  { id: 9, title: 'A Torre de Babel', category: 'Gênesis', testament: 'AT', verse: 'Edifiquemos uma torre cujo cume toque nos céus.', verseReference: 'Gênesis 11:4', imageUrl: '', difficulty: 'fácil' },
  { id: 10, title: 'Abraão e as Estrelas', category: 'Gênesis', testament: 'AT', verse: 'Conta as estrelas, assim será a tua descendência.', verseReference: 'Gênesis 15:5', imageUrl: '', difficulty: 'fácil' },
  
  // ÊXODO (11-18)
  { id: 11, title: 'Moisés no Cesto', category: 'Êxodo', testament: 'AT', verse: 'E pô-lo num cesto de juncos.', verseReference: 'Êxodo 2:3', imageUrl: '', difficulty: 'médio' },
  { id: 12, title: 'A Sarça Ardente', category: 'Êxodo', testament: 'AT', verse: 'E eis que a sarça ardia no fogo.', verseReference: 'Êxodo 3:2', imageUrl: '', difficulty: 'médio' },
  { id: 13, title: 'As Dez Pragas', category: 'Êxodo', testament: 'AT', verse: 'Deixa ir o meu povo.', verseReference: 'Êxodo 7:16', imageUrl: '', difficulty: 'médio' },
  { id: 14, title: 'A Páscoa', category: 'Êxodo', testament: 'AT', verse: 'É a páscoa do Senhor.', verseReference: 'Êxodo 12:11', imageUrl: '', difficulty: 'médio' },
  { id: 15, title: 'Travessia do Mar Vermelho', category: 'Êxodo', testament: 'AT', verse: 'E as águas se dividiram.', verseReference: 'Êxodo 14:21', imageUrl: '', difficulty: 'médio' },
  { id: 16, title: 'O Maná do Céu', category: 'Êxodo', testament: 'AT', verse: 'Eis que vos farei chover pão dos céus.', verseReference: 'Êxodo 16:4', imageUrl: '', difficulty: 'médio' },
  { id: 17, title: 'Os Dez Mandamentos', category: 'Êxodo', testament: 'AT', verse: 'E escreveu nas tábuas as palavras da aliança.', verseReference: 'Êxodo 34:28', imageUrl: '', difficulty: 'médio' },
  { id: 18, title: 'O Tabernáculo', category: 'Êxodo', testament: 'AT', verse: 'E me farão um santuário, e habitarei no meio deles.', verseReference: 'Êxodo 25:8', imageUrl: '', difficulty: 'médio' },
  
  // NÚMEROS E DEUTERONÔMIO (19-22)
  { id: 19, title: 'Os Doze Espias', category: 'Números', testament: 'AT', verse: 'E cortaram dali um ramo com um cacho de uvas.', verseReference: 'Números 13:23', imageUrl: '', difficulty: 'médio' },
  { id: 20, title: 'A Serpente de Bronze', category: 'Números', testament: 'AT', verse: 'Faze uma serpente de bronze.', verseReference: 'Números 21:8', imageUrl: '', difficulty: 'médio' },
  { id: 21, title: 'Balaão e a Jumenta', category: 'Números', testament: 'AT', verse: 'E o Senhor abriu a boca da jumenta.', verseReference: 'Números 22:28', imageUrl: '', difficulty: 'médio' },
  { id: 22, title: 'Moisés vê a Terra Prometida', category: 'Deuteronômio', testament: 'AT', verse: 'Esta é a terra que jurei a Abraão.', verseReference: 'Deuteronômio 34:4', imageUrl: '', difficulty: 'médio' },
  
  // JOSUÉ E JUÍZES (23-30)
  { id: 23, title: 'As Muralhas de Jericó', category: 'Josué', testament: 'AT', verse: 'E o muro caiu abaixo.', verseReference: 'Josué 6:20', imageUrl: '', difficulty: 'difícil' },
  { id: 24, title: 'O Sol Parou', category: 'Josué', testament: 'AT', verse: 'Sol, detém-te em Gibeom.', verseReference: 'Josué 10:12', imageUrl: '', difficulty: 'difícil' },
  { id: 25, title: 'Débora, a Juíza', category: 'Juízes', testament: 'AT', verse: 'Débora, profetisa, julgava a Israel.', verseReference: 'Juízes 4:4', imageUrl: '', difficulty: 'difícil' },
  { id: 26, title: 'Gideão e os 300', category: 'Juízes', testament: 'AT', verse: 'Pelos trezentos homens vos livrarei.', verseReference: 'Juízes 7:7', imageUrl: '', difficulty: 'difícil' },
  { id: 27, title: 'Sansão e o Leão', category: 'Juízes', testament: 'AT', verse: 'E despedaçou o leão.', verseReference: 'Juízes 14:6', imageUrl: '', difficulty: 'difícil' },
  { id: 28, title: 'Sansão e Dalila', category: 'Juízes', testament: 'AT', verse: 'Toda a sua força se foi.', verseReference: 'Juízes 16:19', imageUrl: '', difficulty: 'difícil' },
  { id: 29, title: 'Sansão Derruba o Templo', category: 'Juízes', testament: 'AT', verse: 'E a casa caiu sobre os príncipes.', verseReference: 'Juízes 16:30', imageUrl: '', difficulty: 'difícil' },
  { id: 30, title: 'Rute e Noemi', category: 'Rute', testament: 'AT', verse: 'Aonde quer que tu fores, irei eu.', verseReference: 'Rute 1:16', imageUrl: '', difficulty: 'difícil' },
  
  // SAMUEL E REIS (31-42)
  { id: 31, title: 'Samuel é Chamado', category: 'Samuel', testament: 'AT', verse: 'Fala, Senhor, porque o teu servo ouve.', verseReference: '1 Samuel 3:9', imageUrl: '', difficulty: 'difícil' },
  { id: 32, title: 'Davi é Ungido', category: 'Samuel', testament: 'AT', verse: 'Samuel ungiu a Davi.', verseReference: '1 Samuel 16:13', imageUrl: '', difficulty: 'difícil' },
  { id: 33, title: 'Davi e Golias', category: 'Samuel', testament: 'AT', verse: 'Tu vens a mim com espada, mas eu venho em nome do Senhor.', verseReference: '1 Samuel 17:45', imageUrl: '', difficulty: 'difícil' },
  { id: 34, title: 'A Amizade de Davi e Jônatas', category: 'Samuel', testament: 'AT', verse: 'A alma de Jônatas se ligou à alma de Davi.', verseReference: '1 Samuel 18:1', imageUrl: '', difficulty: 'difícil' },
  { id: 35, title: 'Davi e a Harpa', category: 'Samuel', testament: 'AT', verse: 'Davi tomava a harpa e a tocava.', verseReference: '1 Samuel 16:23', imageUrl: '', difficulty: 'difícil' },
  { id: 36, title: 'Salomão Pede Sabedoria', category: 'Reis', testament: 'AT', verse: 'Dá ao teu servo um coração entendido.', verseReference: '1 Reis 3:9', imageUrl: '', difficulty: 'difícil' },
  { id: 37, title: 'O Julgamento de Salomão', category: 'Reis', testament: 'AT', verse: 'Dividi a criança viva em duas partes.', verseReference: '1 Reis 3:25', imageUrl: '', difficulty: 'difícil' },
  { id: 38, title: 'O Templo de Salomão', category: 'Reis', testament: 'AT', verse: 'A glória do Senhor encheu a casa.', verseReference: '1 Reis 8:11', imageUrl: '', difficulty: 'difícil' },
  { id: 39, title: 'A Rainha de Sabá', category: 'Reis', testament: 'AT', verse: 'Vim ver com os meus próprios olhos.', verseReference: '1 Reis 10:7', imageUrl: '', difficulty: 'difícil' },
  { id: 40, title: 'Elias e os Corvos', category: 'Reis', testament: 'AT', verse: 'E os corvos lhe traziam pão e carne.', verseReference: '1 Reis 17:6', imageUrl: '', difficulty: 'difícil' },
  { id: 41, title: 'Elias no Monte Carmelo', category: 'Reis', testament: 'AT', verse: 'O Deus que responder por fogo, esse é Deus.', verseReference: '1 Reis 18:24', imageUrl: '', difficulty: 'difícil' },
  { id: 42, title: 'Elias Sobe ao Céu', category: 'Reis', testament: 'AT', verse: 'Elias subiu ao céu num redemoinho.', verseReference: '2 Reis 2:11', imageUrl: '', difficulty: 'difícil' },
  
  // PROFETAS (43-50)
  { id: 43, title: 'Eliseu e o Azeite', category: 'Profetas', testament: 'AT', verse: 'Vai, vende o azeite, e paga a tua dívida.', verseReference: '2 Reis 4:7', imageUrl: '', difficulty: 'difícil' },
  { id: 44, title: 'Naamã é Curado', category: 'Profetas', testament: 'AT', verse: 'E a sua carne se tornou como a carne duma criança.', verseReference: '2 Reis 5:14', imageUrl: '', difficulty: 'difícil' },
  { id: 45, title: 'Jonas e a Baleia', category: 'Profetas', testament: 'AT', verse: 'E preparou o Senhor um grande peixe.', verseReference: 'Jonas 1:17', imageUrl: '', difficulty: 'difícil' },
  { id: 46, title: 'Jonas em Nínive', category: 'Profetas', testament: 'AT', verse: 'Nínive se arrependeu.', verseReference: 'Jonas 3:10', imageUrl: '', difficulty: 'difícil' },
  { id: 47, title: 'Daniel na Cova dos Leões', category: 'Profetas', testament: 'AT', verse: 'Meu Deus enviou o seu anjo e fechou a boca dos leões.', verseReference: 'Daniel 6:22', imageUrl: '', difficulty: 'difícil' },
  { id: 48, title: 'Os Três Jovens na Fornalha', category: 'Profetas', testament: 'AT', verse: 'O fogo não teve poder algum sobre os seus corpos.', verseReference: 'Daniel 3:27', imageUrl: '', difficulty: 'difícil' },
  { id: 49, title: 'A Visão de Ezequiel', category: 'Profetas', testament: 'AT', verse: 'Abriram-se os céus, e eu vi visões de Deus.', verseReference: 'Ezequiel 1:1', imageUrl: '', difficulty: 'difícil' },
  { id: 50, title: 'O Vale dos Ossos Secos', category: 'Profetas', testament: 'AT', verse: 'Eis que os farei reviver.', verseReference: 'Ezequiel 37:5', imageUrl: '', difficulty: 'difícil' },
  
  // NOVO TESTAMENTO - NASCIMENTO DE JESUS (51-58)
  { id: 51, title: 'Anunciação a Maria', category: 'Nascimento', testament: 'NT', verse: 'Alegra-te, muito favorecida!', verseReference: 'Lucas 1:28', imageUrl: '', difficulty: 'fácil' },
  { id: 52, title: 'Maria Visita Isabel', category: 'Nascimento', testament: 'NT', verse: 'Bendita és tu entre as mulheres.', verseReference: 'Lucas 1:42', imageUrl: '', difficulty: 'fácil' },
  { id: 53, title: 'O Sonho de José', category: 'Nascimento', testament: 'NT', verse: 'José, não temas receber Maria.', verseReference: 'Mateus 1:20', imageUrl: '', difficulty: 'fácil' },
  { id: 54, title: 'O Nascimento de Jesus', category: 'Nascimento', testament: 'NT', verse: 'Deu à luz o seu filho primogênito.', verseReference: 'Lucas 2:7', imageUrl: '', difficulty: 'fácil' },
  { id: 55, title: 'Os Pastores e os Anjos', category: 'Nascimento', testament: 'NT', verse: 'Glória a Deus nas alturas.', verseReference: 'Lucas 2:14', imageUrl: '', difficulty: 'fácil' },
  { id: 56, title: 'Os Reis Magos', category: 'Nascimento', testament: 'NT', verse: 'Vimos a sua estrela no oriente.', verseReference: 'Mateus 2:2', imageUrl: '', difficulty: 'fácil' },
  { id: 57, title: 'Simeão no Templo', category: 'Nascimento', testament: 'NT', verse: 'Os meus olhos viram a tua salvação.', verseReference: 'Lucas 2:30', imageUrl: '', difficulty: 'fácil' },
  { id: 58, title: 'A Fuga para o Egito', category: 'Nascimento', testament: 'NT', verse: 'Foge para o Egito.', verseReference: 'Mateus 2:13', imageUrl: '', difficulty: 'fácil' },
  
  // INFÂNCIA E PREPARAÇÃO (59-63)
  { id: 59, title: 'Jesus no Templo aos 12 Anos', category: 'Infância', testament: 'NT', verse: 'Não sabíeis que me convinha tratar dos negócios de meu Pai?', verseReference: 'Lucas 2:49', imageUrl: '', difficulty: 'médio' },
  { id: 60, title: 'João Batista no Deserto', category: 'Preparação', testament: 'NT', verse: 'Preparai o caminho do Senhor.', verseReference: 'Mateus 3:3', imageUrl: '', difficulty: 'médio' },
  { id: 61, title: 'O Batismo de Jesus', category: 'Preparação', testament: 'NT', verse: 'Este é o meu Filho amado.', verseReference: 'Mateus 3:17', imageUrl: '', difficulty: 'médio' },
  { id: 62, title: 'A Tentação no Deserto', category: 'Preparação', testament: 'NT', verse: 'Vai-te, Satanás!', verseReference: 'Mateus 4:10', imageUrl: '', difficulty: 'médio' },
  { id: 63, title: 'Jesus Chama os Discípulos', category: 'Preparação', testament: 'NT', verse: 'Vinde após mim, e eu vos farei pescadores de homens.', verseReference: 'Mateus 4:19', imageUrl: '', difficulty: 'médio' },
  
  // MINISTÉRIO E MILAGRES (64-80)
  { id: 64, title: 'As Bodas de Caná', category: 'Milagres', testament: 'NT', verse: 'Enchei de água essas talhas.', verseReference: 'João 2:7', imageUrl: '', difficulty: 'médio' },
  { id: 65, title: 'Jesus e Nicodemos', category: 'Ministério', testament: 'NT', verse: 'Necessário vos é nascer de novo.', verseReference: 'João 3:7', imageUrl: '', difficulty: 'médio' },
  { id: 66, title: 'A Mulher Samaritana', category: 'Ministério', testament: 'NT', verse: 'Eu sou a água da vida.', verseReference: 'João 4:14', imageUrl: '', difficulty: 'médio' },
  { id: 67, title: 'A Pesca Milagrosa', category: 'Milagres', testament: 'NT', verse: 'Lança a rede para pescar.', verseReference: 'Lucas 5:4', imageUrl: '', difficulty: 'médio' },
  { id: 68, title: 'A Cura do Paralítico', category: 'Milagres', testament: 'NT', verse: 'Levanta-te, toma o teu leito e anda.', verseReference: 'Marcos 2:11', imageUrl: '', difficulty: 'médio' },
  { id: 69, title: 'A Mão Seca Restaurada', category: 'Milagres', testament: 'NT', verse: 'Estende a tua mão.', verseReference: 'Marcos 3:5', imageUrl: '', difficulty: 'médio' },
  { id: 70, title: 'A Purificação do Leproso', category: 'Milagres', testament: 'NT', verse: 'Quero, sê limpo.', verseReference: 'Marcos 1:41', imageUrl: '', difficulty: 'médio' },
  { id: 71, title: 'A Fé do Centurião', category: 'Milagres', testament: 'NT', verse: 'Não achei tamanha fé nem em Israel.', verseReference: 'Mateus 8:10', imageUrl: '', difficulty: 'médio' },
  { id: 72, title: 'A Ressurreição do Filho da Viúva', category: 'Milagres', testament: 'NT', verse: 'Jovem, a ti te digo, levanta-te.', verseReference: 'Lucas 7:14', imageUrl: '', difficulty: 'médio' },
  { id: 73, title: 'Jesus Acalma a Tempestade', category: 'Milagres', testament: 'NT', verse: 'Cala-te, aquieta-te.', verseReference: 'Marcos 4:39', imageUrl: '', difficulty: 'médio' },
  { id: 74, title: 'O Endemoninhado Gadareno', category: 'Milagres', testament: 'NT', verse: 'Sai deste homem, espírito imundo.', verseReference: 'Marcos 5:8', imageUrl: '', difficulty: 'médio' },
  { id: 75, title: 'A Filha de Jairo', category: 'Milagres', testament: 'NT', verse: 'Talita cumi - Menina, levanta-te.', verseReference: 'Marcos 5:41', imageUrl: '', difficulty: 'médio' },
  { id: 76, title: 'A Mulher com Fluxo de Sangue', category: 'Milagres', testament: 'NT', verse: 'A tua fé te salvou.', verseReference: 'Marcos 5:34', imageUrl: '', difficulty: 'médio' },
  { id: 77, title: 'A Multiplicação dos Pães', category: 'Milagres', testament: 'NT', verse: 'Todos comeram e se fartaram.', verseReference: 'Mateus 14:20', imageUrl: '', difficulty: 'médio' },
  { id: 78, title: 'Jesus Anda Sobre as Águas', category: 'Milagres', testament: 'NT', verse: 'Tende bom ânimo, sou eu, não temais.', verseReference: 'Mateus 14:27', imageUrl: '', difficulty: 'médio' },
  { id: 79, title: 'A Transfiguração', category: 'Milagres', testament: 'NT', verse: 'O seu rosto resplandeceu como o sol.', verseReference: 'Mateus 17:2', imageUrl: '', difficulty: 'médio' },
  { id: 80, title: 'A Ressurreição de Lázaro', category: 'Milagres', testament: 'NT', verse: 'Lázaro, vem para fora!', verseReference: 'João 11:43', imageUrl: '', difficulty: 'médio' },
  
  // PARÁBOLAS (81-88)
  { id: 81, title: 'O Semeador', category: 'Parábolas', testament: 'NT', verse: 'Eis que o semeador saiu a semear.', verseReference: 'Mateus 13:3', imageUrl: '', difficulty: 'difícil' },
  { id: 82, title: 'O Joio e o Trigo', category: 'Parábolas', testament: 'NT', verse: 'Deixai crescer ambos juntos até à ceifa.', verseReference: 'Mateus 13:30', imageUrl: '', difficulty: 'difícil' },
  { id: 83, title: 'O Grão de Mostarda', category: 'Parábolas', testament: 'NT', verse: 'É a menor de todas as sementes.', verseReference: 'Mateus 13:32', imageUrl: '', difficulty: 'difícil' },
  { id: 84, title: 'O Fermento', category: 'Parábolas', testament: 'NT', verse: 'É semelhante ao fermento.', verseReference: 'Mateus 13:33', imageUrl: '', difficulty: 'difícil' },
  { id: 85, title: 'O Tesouro Escondido', category: 'Parábolas', testament: 'NT', verse: 'E, pelo gozo dele, vai, vende tudo.', verseReference: 'Mateus 13:44', imageUrl: '', difficulty: 'difícil' },
  { id: 86, title: 'A Pérola de Grande Valor', category: 'Parábolas', testament: 'NT', verse: 'Vendeu tudo quanto tinha.', verseReference: 'Mateus 13:46', imageUrl: '', difficulty: 'difícil' },
  { id: 87, title: 'O Filho Pródigo', category: 'Parábolas', testament: 'NT', verse: 'Pai, pequei contra o céu e perante ti.', verseReference: 'Lucas 15:21', imageUrl: '', difficulty: 'difícil' },
  { id: 88, title: 'O Bom Samaritano', category: 'Parábolas', testament: 'NT', verse: 'Vai, e faze da mesma maneira.', verseReference: 'Lucas 10:37', imageUrl: '', difficulty: 'difícil' },
  
  // PAIXÃO E RESSURREIÇÃO (89-98)
  { id: 89, title: 'A Entrada Triunfal', category: 'Paixão', testament: 'NT', verse: 'Hosana ao Filho de Davi!', verseReference: 'Mateus 21:9', imageUrl: '', difficulty: 'difícil' },
  { id: 90, title: 'A Última Ceia', category: 'Paixão', testament: 'NT', verse: 'Isto é o meu corpo, que por vós é dado.', verseReference: 'Lucas 22:19', imageUrl: '', difficulty: 'difícil' },
  { id: 91, title: 'Jesus Lava os Pés', category: 'Paixão', testament: 'NT', verse: 'Eu vos dei o exemplo.', verseReference: 'João 13:15', imageUrl: '', difficulty: 'difícil' },
  { id: 92, title: 'A Oração no Getsêmani', category: 'Paixão', testament: 'NT', verse: 'Não seja feita a minha vontade, mas a tua.', verseReference: 'Lucas 22:42', imageUrl: '', difficulty: 'difícil' },
  { id: 93, title: 'A Traição de Judas', category: 'Paixão', testament: 'NT', verse: 'Judas, com um beijo trais o Filho do Homem?', verseReference: 'Lucas 22:48', imageUrl: '', difficulty: 'difícil' },
  { id: 94, title: 'O Julgamento Perante Pilatos', category: 'Paixão', testament: 'NT', verse: 'Que farei de Jesus?', verseReference: 'Mateus 27:22', imageUrl: '', difficulty: 'difícil' },
  { id: 95, title: 'A Crucificação', category: 'Paixão', testament: 'NT', verse: 'Está consumado.', verseReference: 'João 19:30', imageUrl: '', difficulty: 'difícil' },
  { id: 96, title: 'A Ressurreição', category: 'Ressurreição', testament: 'NT', verse: 'Ele não está aqui, ressuscitou.', verseReference: 'Mateus 28:6', imageUrl: '', difficulty: 'difícil' },
  { id: 97, title: 'O Caminho de Emaús', category: 'Ressurreição', testament: 'NT', verse: 'Os seus olhos se abriram.', verseReference: 'Lucas 24:31', imageUrl: '', difficulty: 'difícil' },
  { id: 98, title: 'Tomé Vê e Crê', category: 'Ressurreição', testament: 'NT', verse: 'Senhor meu e Deus meu!', verseReference: 'João 20:28', imageUrl: '', difficulty: 'difícil' },
  
  // ATOS E IGREJA (99-100)
  { id: 99, title: 'O Pentecostes', category: 'Atos', testament: 'NT', verse: 'Todos foram cheios do Espírito Santo.', verseReference: 'Atos 2:4', imageUrl: '', difficulty: 'difícil' },
  { id: 100, title: 'A Ascensão de Jesus', category: 'Atos', testament: 'NT', verse: 'Foi elevado às alturas.', verseReference: 'Atos 1:9', imageUrl: '', difficulty: 'difícil' },
];

export const getPuzzlesByTestament = (testament: 'AT' | 'NT') => 
  PUZZLE_IMAGES.filter(p => p.testament === testament);

export const getPuzzlesByCategory = (category: string) => 
  PUZZLE_IMAGES.filter(p => p.category === category);

export const getPuzzleCategories = () => {
  const categories = new Set(PUZZLE_IMAGES.map(p => p.category));
  return Array.from(categories);
};
