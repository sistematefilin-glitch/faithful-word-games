

## Plano: Peças de Quebra-Cabeça com Formato Realista e Borda Marcada

### Problema Atual

O código em `PuzzlePieceSvg.tsx` usa curvas Bézier simples que não reproduzem a forma clássica de "ombros + pescoço + cabeça" de peças de quebra-cabeça reais. O resultado são encaixes geométricos/estranhos em vez do visual tradicional.

### Solução

Implementar um novo gerador de path SVG baseado no padrão "Shoulders & Head" com **6 curvas Bézier cúbicas por lado**:

```text
          ╭───╮         ← Cabeça (arredondada)
         ╱     ╲        ← Pescoço (estreito)
    ────╱       ╲────   ← Ombros (transição suave)
```

### Arquitetura do Path

Cada "tab" (orelha para fora) ou "slot" (encaixe para dentro) será composto por 6 segmentos de curva Bézier cúbica:

| Segmento | Descrição |
|----------|-----------|
| 1 | Ombro esquerdo - transição da borda para o pescoço |
| 2 | Pescoço esquerdo - afunilamento |
| 3 | Cabeça esquerda - início da curva arredondada |
| 4 | Cabeça direita - fim da curva arredondada |
| 5 | Pescoço direito - afunilamento |
| 6 | Ombro direito - transição de volta à borda |

### Pontos de Controle Bezier (baseado em referência real)

Usando coordenadas normalizadas (0-100), os pontos de controle para uma "tab" serão:

```text
┌────────────────────────────────────────────────────────────┐
│  Linha base: y = 0 (para borda superior)                   │
│                                                            │
│  Ombro esquerdo:  (0,0) → CP1(35,15) CP2(37,5) → (37,5)   │
│  Pescoço esquerdo: → CP1(40,0) CP2(38,-5) → (38,-5)       │
│  Cabeça esquerda:  → CP1(20,-20) CP2(50,-20) → (50,-20)   │
│  Cabeça direita:   → CP1(80,-20) CP2(62,-5) → (62,-5)     │
│  Pescoço direito:  → CP1(60,0) CP2(63,5) → (63,5)         │
│  Ombro direito:    → CP1(65,15) CP2(100,0) → (100,0)      │
└────────────────────────────────────────────────────────────┘
```

### Mudanças Técnicas

**Arquivo: `src/components/games/PuzzlePieceSvg.tsx`**

1. Substituir as funções `edgeTop`, `edgeRight`, `edgeBottom`, `edgeLeft` por uma nova implementação com 6 curvas Bézier cada

2. Usar pontos de controle que criam a forma clássica "ombros + pescoço + cabeça"

3. Adicionar borda mais grossa e marcada (2-3px) com cor de destaque

4. Adicionar sombra sutil (drop-shadow via filtro SVG) para efeito de "recortado"

### Detalhes da Implementação

**Nova função de geração de borda:**

```typescript
// Pontos de controle para forma "ombros + cabeça"
const shouldersAndHead = {
  // Ombro esquerdo: transição suave da borda
  shoulder1: { cx1: 0, cy1: 0, cx2: 35, cy2: 15, ex: 37, ey: 5 },
  // Pescoço esquerdo: afunila
  neck1: { cx1: 37, cy1: 5, cx2: 40, cy2: 0, ex: 38, ey: -5 },
  // Cabeça esquerda: curva para o topo
  head1: { cx1: 38, cy1: -5, cx2: 20, cy2: -20, ex: 50, ey: -20 },
  // Cabeça direita: curva descendo
  head2: { cx1: 50, cy1: -20, cx2: 80, cy2: -20, ex: 62, ey: -5 },
  // Pescoço direito: alarga
  neck2: { cx1: 62, cy1: -5, cx2: 60, cy2: 0, ex: 63, ey: 5 },
  // Ombro direito: volta à borda
  shoulder2: { cx1: 63, cy1: 5, cx2: 65, cy2: 15, ex: 100, ey: 0 },
};
```

**Borda marcada (visual de papelão):**

```typescript
// Contorno mais grosso e escuro
<path
  d={d}
  fill="none"
  stroke="hsl(30, 20%, 25%)"  // Marrom escuro
  strokeWidth={2.5}
  strokeLinejoin="round"
  strokeLinecap="round"
/>
```

**Sombra para profundidade:**

```typescript
<defs>
  <filter id="piece-shadow">
    <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.4"/>
  </filter>
</defs>
```

### Resultado Visual Esperado

| Antes | Depois |
|-------|--------|
| Encaixes geométricos/angulares | Forma clássica com curvas suaves |
| Borda fina e discreta | Borda grossa marrom (papelão) |
| Sem profundidade | Sombra sutil 3D |
| Transições abruptas | Ombros + pescoço + cabeça fluidos |

### Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `src/components/games/PuzzlePieceSvg.tsx` | Reescrever funções de borda com 6 curvas Bézier cada + borda marcada + sombra |

