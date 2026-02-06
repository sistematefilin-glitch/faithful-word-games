

## Plano: Peças de Quebra-Cabeça Idênticas às Reais

### Problema

A implementação atual usa curvas quadráticas (Q) e arcos SVG (A) que criam formas geométricas artificiais. Peças reais de quebra-cabeça têm uma forma orgânica específica que só pode ser reproduzida com **curvas Bézier cúbicas (C)** bem calibradas.

### Abordagem

Reescrever completamente a função `createTabPath` usando **apenas curvas Bézier cúbicas (C)** com pontos de controle extraídos de geometria real de dies de corte de quebra-cabeça. A forma real de uma peça tem:

```text
    Borda plana ──────╮      ╭────── Borda plana
                       ╲    ╱
                  Ombro  ╲╱  Ombro
                         ││
                   Pescoço││Pescoço
                         ╱╲
                  Cabeça╱  ╲Cabeça
                       ╱    ╲
                      ╰──────╯
```

A cabeça é **mais larga que o pescoço**, com transições suaves e orgânicas em cada ponto.

### Mudanças Técnicas

**Arquivo: `src/components/games/PuzzlePieceSvg.tsx`**

1. **Eliminar Q e A commands** - Usar APENAS curvas C (Bézier cúbicas) para total controle sobre a forma

2. **Novos parâmetros de geometria calibrados:**
   - `TAB_SIZE = 20` (profundidade do tab)  
   - Tab começa em 35% e termina em 65% da borda (centralizado)
   - Pescoço em ~42%-58% (estreito)
   - Cabeça se expande para ~33%-67% (mais larga que o pescoço)

3. **5 curvas C por tab** (em vez de Q+A):

| Segmento | De | Para | Efeito |
|----------|-----|------|--------|
| C1 | Borda (35%) | Ombro | Curva suave para baixo/cima |
| C2 | Ombro | Pescoço | Afunila para o ponto mais estreito |
| C3 | Pescoço | Cabeça esquerda | Expande para a cabeça arredondada |
| C4 | Cabeça esquerda | Cabeça direita | Arco circular perfeito no topo |
| C5 | Cabeça direita | Pescoço | Volta ao pescoço |
| C6 | Pescoço | Ombro | Alarga de volta |
| C7 | Ombro | Borda (65%) | Retorna suavemente à borda |

4. **Pontos de controle para forma "cogumelo" real:**

```typescript
// Para borda horizontal (top), sign=1 (tab para cima, y negativo):
// Coordenadas em espaço 0-100

// Ombro esquerdo: transição suave da borda
`C ${35+2},0  ${38},${-3}  ${40},${-8}`
// Pescoço esquerdo: afunila
`C ${41},${-11}  ${42},${-15}  ${43},${-16}`  
// Cabeça esquerda: expande
`C ${37},${-18}  ${34},${-22}  ${38},${-25}`
// Topo da cabeça: arco amplo e redondo  
`C ${42},${-28}  ${58},${-28}  ${62},${-25}`
// Cabeça direita: volta
`C ${66},${-22}  ${63},${-18}  ${57},${-16}`
// Pescoço direito: afunila
`C ${58},${-15}  ${59},${-11}  ${60},${-8}`
// Ombro direito: volta à borda
`C ${62},${-3}  ${63},0  ${65},0`
```

5. **Mesma lógica para bordas verticais** (rotação 90 graus dos pontos)

6. **Visual:**
   - Manter borda grossa marrom 2.5px (`#3d2817`)
   - Manter sombra `feDropShadow`
   - ViewBox `-25 -25 150 150` (espaço para tabs)

### Resultado

| Aspecto | Antes | Depois |
|---------|-------|--------|
| Tipo de curva | Q + A (geométrico) | Apenas C (orgânico) |
| Forma da cabeça | Arco circular rígido | Cogumelo arredondado natural |
| Pescoço | Transição abrupta | Afunilamento gradual |
| Ombros | Angular | Curvatura suave S |
| Aparência | Artificial/geométrica | Idêntica a peça real |

### Arquivo Modificado

| Arquivo | Alteração |
|---------|-----------|
| `src/components/games/PuzzlePieceSvg.tsx` | Reescrever `createTabPath` com 7 curvas Bézier cúbicas (C) por borda, eliminando Q e A |

