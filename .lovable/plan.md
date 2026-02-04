

## Plano: Orelhas Mais Arredondadas

### Problema Atual

As orelhas (tabs) das pecas usam um arco SVG (`A` command) com raio eliptico (`headR * 0.9`) que cria uma forma ligeiramente achatada. O pescoco tambem tem curvas quadraticas (`Q`) que podem parecer angulares.

### Solucao

Aumentar o `HEAD_RADIUS` e usar um arco **perfeitamente circular** (raios iguais) para criar orelhas mais redondas e organicas.

### Mudancas Tecnicas

**Arquivo: `src/components/games/PuzzlePieceSvg.tsx`**

1. **Aumentar raio da cabeca:**
   - De `HEAD_RADIUS = 14` para `HEAD_RADIUS = 16`

2. **Arco perfeitamente circular:**
   - Mudar de `A ${headR} ${headR * 0.9}` para `A ${headR} ${headR}`
   - Isso remove o achatamento e cria um circulo perfeito

3. **Suavizar transicao do pescoco:**
   - Ajustar pontos de controle das curvas Q para uma transicao mais fluida
   - Aumentar ligeiramente `NECK_WIDTH` de 8 para 10 para curvas mais suaves

### Codigo Atualizado

```typescript
// Geometria mais arredondada
const TAB_DEPTH = 20;
const NECK_WIDTH = 10;     // Ligeiramente mais largo
const HEAD_RADIUS = 16;    // Cabeca maior e mais arredondada

// Arco perfeitamente circular (antes era eliptico)
// Antes: A ${headR} ${headR * 0.9} ...
// Depois: A ${headR} ${headR} ...
`A ${headR} ${headR} 0 1 0 ${neckPoint + headR} ${tabY}`
```

### Resultado Visual

| Antes | Depois |
|-------|--------|
| Arco eliptico (0.9x) | Arco circular perfeito |
| Cabeca 14px | Cabeca 16px |
| Pescoco 8px | Pescoco 10px |
| Transicao abrupta | Transicao suave |

### Arquivo Modificado

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/games/PuzzlePieceSvg.tsx` | Ajustar `HEAD_RADIUS`, `NECK_WIDTH` e comandos `A` para arcos circulares |

