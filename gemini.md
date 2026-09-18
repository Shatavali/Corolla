# Project Constitution: Chess Opening Explainer (1800+ Elo) - Fast Analysis Module (Prototype 1)

> **Document Type:** System Architecture & Project Constitution  
> **Target Audience:** High-Intermediate to Master/Titled Players (1800 – 2500+ Elo / FIDE / Lichess)  
> **Tech Stack:** MERN (MongoDB, Express.js, React/Vite, Node.js) + Lichess Open APIs + Dynamic LLM Engine  
> **Architecture Pattern:** Spec-Driven Vertical Slice with Clean Frontend/Backend Separation  

---

## 1. Architectural Decisions & Core Invariants

### 1.1 Target Persona & Pedagogical Standard
* **Audience:** FIDE 1800+, Lichess 2000+, Chess.com 1900+.
* **Tone & Content:** Dynamic, conversational, coaching-style natural language (Markdown).
  - **No generic beginner fluff** (avoid trivial advice like "develop pieces" or "control the center").
  - **Focus on master insights:** Immediate structural pawn levers, move-order nuances (moves 5–15), tactical traps, refutations, and positional tabiyas.

---

### 1.2 The Golden Rule of FEN Normalization (Primary Database Key)

```
Standard FEN:   rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1
Normalized FEN: rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3
                \_________________________________________/ ^ ^^^^ ^^
                                (Field 1)                   |   |  |
                                             Active Color --+   |  |
                                             Castling Rights ---+  |
                                             En Passant Target ----+
```

#### Invariant Rules:
1. **4-Field Normalization:** All internal position hashing, MongoDB index lookups, Lichess caching, and AI explanation lookups **MUST** use the 4-field normalized FEN:
   $$\text{FEN}_{\text{norm}} = \text{Field}_1 + \text{ " " } + \text{Field}_2 + \text{ " " } + \text{Field}_3 + \text{ " " } + \text{Field}_4$$
2. **Exclusion of Clocks:** Field 5 (`halfmove_clock`) and Field 6 (`fullmove_number`) are strictly stripped to guarantee $100\%$ cache hits across transpositions.

---

### 1.3 Key Architectural Resolution Matrix

| Component / Subsystem | Architectural Decision | Implementation Specification |
| :--- | :--- | :--- |
| **API & Caching Strategy** | **Layer-by-Layer Pre-fetch** | Seed common 1 to 7 move sequences of main openings (Ruy Lopez, Italian, Sicilian, etc.) into MongoDB. Expand cache opening-by-opening for sub-millisecond tabiya loads. |
| **LLM Output Format** | **Flexible Markdown Natural Language** | Freeform, human-centric, conversational coaching style. Dynamic depth and nuance tailored for 1800+ players without rigid schema constraints. |
| **Lichess Explorer Source** | **Cascade Method** | Query `/masters` (OTB master games) first. If sample size $< 30$ games, fallback to `/lichess` filtered for `ratings[]=2500` (master-tier online pool). |
| **Move-Order Precision** | **Algorithmic Evaluation Delta** | Compute eval swing when comparing move sequences. If $\Delta \text{eval} > 0.50\text{ cp}$, trigger strict UI warning of inaccuracy/mistake while permitting player progression, and request LLM tactical refutation. |
| **Frontend/Backend Stack** | **Clean MERN Separation** | React + Vite on port `5173`, Express + Node on port `5000` with proxy routing and clean separation of concerns. |

---

## 2. Strict MongoDB Schemas

### 2.1 `OpeningPosition` Schema (`positions` Collection)
Stores the master opening graph node, statistical metrics from master games, ECO classification, and move statistics.

```javascript
const mongoose = require('mongoose');

const MoveStatsSchema = new mongoose.Schema({
  san: { type: String, required: true },           // e.g. "Nf3"
  uci: { type: String, required: true },           // e.g. "g1f3"
  targetFen: { type: String, required: true },     // 4-field normalized target FEN
  whiteWins: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
  blackWins: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  masterFrequency: { type: Number, default: 0 }    // Number of master games recorded
}, { _id: false });

const OpeningPositionSchema = new mongoose.Schema({
  normalizedFen: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  }, // Primary Lookup Key (4 Fields)
  eco: { type: String, index: true },              // e.g. "C88"
  openingName: { type: String, required: true },   // e.g. "Ruy Lopez"
  variation: { type: String, default: "" },        // e.g. "Marshall Attack"
  ply: { type: Number, required: true },           // Move depth (half-moves)
  turn: { type: String, enum: ['w', 'b'], required: true },
  pawnStructure: { type: String, default: 'Unknown' },
  keyThemes: [{ type: String }],
  playableMoves: [MoveStatsSchema],
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'opening_positions'
});

OpeningPositionSchema.index({ eco: 1, ply: 1 });
```

---

### 2.2 `AIExplanation` Schema (`ai_explanations` Collection)
Stores the natural language, coaching-style master analyses generated by the integrated LLM engine.

```javascript
const AIExplanationSchema = new mongoose.Schema({
  normalizedFen: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  targetEloTier: { 
    type: String, 
    default: '1800-2400+' 
  },
  content: { 
    type: String, 
    required: true 
  }, // Rich Markdown natural language coaching explanation
  tacticalFlag: { 
    type: String, 
    default: "" 
  }, // Optional 1-sentence critical highlight if move-order sensitive
  promptVersion: { 
    type: String, 
    default: "v1.0-fast-analysis" 
  },
  modelIdentifier: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true,
  collection: 'ai_explanations'
});
```

---

### 2.3 `EvaluationCache` Schema (`evaluation_cache` Collection)
High-performance cache layer for Lichess Cloud Evaluation API.

```javascript
const EvaluationCacheSchema = new mongoose.Schema({
  normalizedFen: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  depth: { type: Number, required: true },
  knps: { type: Number },
  evalType: { type: String, enum: ['cp', 'mate'], required: true },
  score: { type: Number, required: true },         // Centipawns or turns to mate
  pv: [{ type: String }],                          // Principal Variation (UCI moves)
  source: { 
    type: String, 
    enum: ['lichess_cloud', 'local_stockfish'], 
    default: 'lichess_cloud' 
  },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 30*24*60*60*1000) } // 30 days TTL
}, {
  timestamps: true,
  collection: 'evaluation_cache'
});
```

---

## 3. Express Backend Architecture & Pipeline

### 3.1 Pipeline Flow
```
[Client (React)] 
      │
      ▼  GET /api/v1/position/analyze?fen=...
[Rate Limiter & Input Sanitizer]
      │
      ▼
[FEN Normalizer Middleware]  --->  Transforms standard FEN to 4-Field Primary Key
      │
      ├──> [1. Check MongoDB Cache (AIExplanation & OpeningPosition)]
      │         │
      │         ├── (Hit) ──> Return cached analysis (< 20ms)
      │         │
      │         └── (Miss) ──┐
      │                      ▼
      ├──> [2. Lichess Cascade Explorer + Cloud Eval]
      │         │ (Try /masters -> if <30 games -> Fallback to /lichess?ratings[]=2500)
      │         ▼
      ├──> [3. Move-Order Delta Check]
      │         │ (Compute swing: if > 0.50 cp -> Flag as Move-Order Inaccuracy)
      │         ▼
      ├──> [4. Invoke LLM Engine (Conversational Markdown Prompt)]
      │         │
      │         ▼
      ├──> [5. Persist to MongoDB Cache]
      │         │
      └─────────┴──> Return unified Fast Analysis payload to Client
```

---

## 4. Core React UI Architecture (Vite + React)

* `ChessboardViewport`: Interactive board with move validation (`chess.js`), move sound effects, and arrow overlays.
* `EvaluationBar`: Dynamic centipawn evaluation bar.
* `MoveNotationTree`: Interactive move tree with ply stepping and move-order warning flags.
* `FastAnalysisPanel`: Markdown-rendered coaching insights and pawn-lever highlights.
* `CascadeExplorerTable`: Tabular master statistics with cascade source badge (`Masters OTB` vs `2500+ Online`).
