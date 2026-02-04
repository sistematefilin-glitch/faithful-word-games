
## Plano: Peças de Quebra-Cabeça com Formato Realista e Borda Marcada

### Problema Atual

O codigo atual em `PuzzlePieceSvg.tsx` usa apenas 3 curvas Bezier por borda com proporcoes simples. Isso cria encaixes que parecem "bolhas" geometricas em vez do formato classico de pecas de quebra-cabeca reais.

### Solucao

Reimplementar as funcoes de borda usando **6 curvas Bezier cubicas** por lado para criar a anatomia classica:

```text
          ╭───╮         <- Cabeca (arredondada, larga)
         ╱     ╲        <- Pescoco (estreito)
    ────╯       ╰────   <- Ombros (transicao suave)
```

### Mudancas Tecnicas

**Arquivo: `src/components/games/PuzzlePieceSvg.tsx`**

1. **Novas proporcoes de geometria:**
   - `tabWidth`: 40 (mais largo para cabeca mais pronunciada)
   - `tabDepth`: 22 (mais profundo)
   - `neckWidth`: 12 (pescoco mais estreito = contraste visual)
   - `shoulderWidth`: 6 (ombros suaves)

2. **Estrutura de 6 curvas por borda:**

| Curva | Descricao |
|-------|-----------|
| 1 | Ombro esquerdo - transicao suave da borda |
| 2 | Pescoco esquerdo - afunila para dentro |
| 3 | Cabeca esquerda - sobe/desce para o topo |
| 4 | Cabeca direita - curva de volta |
| 5 | Pescoco direito - alarga novamente |
| 6 | Ombro direito - volta a borda |

3. **Borda marcada (estilo papelao):**
   - Cor: `hsl(30, 25%, 30%)` (marrom escuro)
   - Espessura: 2.5px
   - `strokeLinejoin: round` e `strokeLinecap: round`

4. **Sombra para profundidade:**
   - Filtro SVG `feDropShadow`
   - dx: 1, dy: 2, stdDeviation: 1.5
   - floodOpacity: 0.35

### Codigo das Novas Bordas

```typescript
// Exemplo para edgeTop com 6 curvas
function edgeTop(sign: number) {
  if (sign === 0) return `L 100 0`;

  const tabW = 40;    // largura total da area do tab
  const tabD = 22;    // profundidade do tab
  const neckW = 12;   // largura do pescoco
  const headW = 24;   // largura da cabeca
  const cx = 50;      // centro
  
  // Pontos chave
  const shoulderL = cx - tabW / 2;      // 30
  const neckL = cx - neckW / 2;         // 44
  const neckR = cx + neckW / 2;         // 56
  const shoulderR = cx + tabW / 2;      // 70
  
  const d = sign * tabD;

  return [
    // Linha ate ombro esquerdo
    `L ${shoulderL} 0`,
    // Ombro esquerdo -> pescoco esquerdo
    `C ${shoulderL + 4} 0, ${neckL - 2} ${d * 0.3}, ${neckL} ${d * 0.45}`,
    // Pescoco esquerdo -> cabeca esquerda
    `C ${neckL + 2} ${d * 0.6}, ${cx - headW/2} ${d * 0.95}, ${cx - headW/2} ${d}`,
    // Cabeca esquerda -> cabeca direita (topo arredondado)
    `C ${cx - headW/4} ${d * 1.1}, ${cx + headW/4} ${d * 1.1}, ${cx + headW/2} ${d}`,
    // Cabeca direita -> pescoco direito
    `C ${cx + headW/2} ${d * 0.95}, ${neckR - 2} ${d * 0.6}, ${neckR} ${d * 0.45}`,
    // Pescoco direito -> ombro direito
    `C ${neckR + 2} ${d * 0.3}, ${shoulderR - 4} 0, ${shoulderR} 0`,
    // Linha ate o fim
    `L 100 0`,
  ].join(" ");
}
```

### Estrutura SVG Atualizada

```tsx
<svg viewBox="-5 -5 110 110"> {/* viewBox expandido para sombra */}
  <defs>
    <filter id="piece-shadow">
      <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-opacity="0.35"/>
    </filter>
    <clipPath id={clipId}>
      <path d={d} />
    </clipPath>
  </defs>

  {/* Imagem recortada */}
  <image ... clipPath={`url(#${clipId})`} />

  {/* Borda marcada com sombra */}
  <path
    d={d}
    fill="none"
    stroke="hsl(30, 25%, 30%)"
    strokeWidth={2.5}
    strokeLinejoin="round"
    strokeLinecap="round"
    filter="url(#piece-shadow)"
  />
</svg>
```

### Resultado Visual Esperado

| Antes | Depois |
|-------|--------|
| 3 curvas simples (bolhas) | 6 curvas anatomicas |
| Pescoco largo | Pescoco estreito (contraste) |
| Cabeca pequena | Cabeca larga e arredondada |
| Borda fina cinza | Borda grossa marrom |
| Sem profundidade | Sombra sutil 3D |

### Arquivo Modificado

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/games/PuzzlePieceSvg.tsx` | Reescrever `edgeTop`, `edgeRight`, `edgeBottom`, `edgeLeft` com 6 curvas cada + borda marcada + sombra SVG |
