# Task Plan: Fast Analysis Module (Prototype 1)

> **Project:** Chess Opening Explainer for High-Intermediate / Master Players (1800+ Elo)  
> **Target Module:** Prototype 1 — Fast Analysis  
> **Methodology:** Spec-Driven Vertical Slice Development  
> **Status:** Transitioning from Protocol Zero to Slice 1 Execution  

---

## Architectural Decisions Locked In

1. **API & Caching Strategy:** Layer-by-Layer Pre-fetch (Seed common 1 to 7 move sequences into MongoDB; expand opening-by-opening).
2. **LLM Output Format:** Flexible, Human-Centric Natural Language (Markdown coaching explanations, no rigid boxes).
3. **Lichess Explorer Source:** Cascade Method (`/masters` primary $\rightarrow$ fallback to `/lichess?ratings[]=2500` if sample $< 30$ games).
4. **Move-Order Precision:** Algorithmic Detection ($\Delta \text{eval} > 0.50\text{ cp}$ triggers UI mistake warning + LLM refutation).
5. **Tech Stack & Separation:** React + Vite (Port `5173`) frontend and Express + Node.js (Port `5000`) backend.

---

## Vertical Slices Breakdown

### Slice 1: MERN Foundation & Health Pipeline (IN PROGRESS)
* **Goal:** Set up clean monorepo/subfolder structure for `server/` (Express + MongoDB connection) and `client/` (React + Vite), verifying end-to-end communication via `/api/health`.
* **Deliverables:**
  - `server/`: Express app, MongoDB connection pooling, CORS, dotenv, `/api/health` endpoint.
  - `client/`: Vite React app with luxury dark mode base CSS and API health-status card.
  - Terminal commands to run both servers concurrently or independently.
* **Verification:** `GET /api/health` returns `200 OK` `{ status: "healthy", db: "connected" }`, and client successfully fetches and displays this status.

---

### Slice 2: Board State & Move Validation (Client Core) [COMPLETED]
* **Goal:** Build interactive chessboard with `chess.js` validation, 4-field FEN normalization, sound effects, and move traversal.
* **Deliverables:**
  - `fenHelper.js`: 4-field FEN normalization function.
  - `ChessBoard.jsx`: Responsive board with drag-and-drop, strict move validation snapback, 5 control buttons, and `/api/position` wiring.
  - `server/routes/position.js`: Normalized FEN receiver endpoint.

---

### Slice 3: Backend Data Layer & Layer-by-Layer Pre-fetch
* **Goal:** Implement MongoDB models with 4-field normalized FEN indexing, and build the opening seed pipeline for moves 1–7 (Ruy Lopez, Italian, Sicilian, etc.).
* **Deliverables:**
  - Mongoose models (`OpeningPosition`, `AIExplanation`, `EvaluationCache`).
  - Layer-by-layer seed script `seedOpenings.js`.
  - Position query API endpoints.

---

### Slice 4: Cascade Lichess Explorer, Cloud Eval & LLM Integration
* **Goal:** Integrate live Lichess `/masters` + `/lichess?ratings[]=2500` cascade, Cloud Eval API, algorithmic move-order delta checking (>0.50 cp), and natural-language LLM coaching generation.
* **Deliverables:**
  - `lichessService.js` (Cascade explorer + Cloud Eval).
  - `moveOrderAnalyzer.js` (Algorithmic delta detection).
  - `llmService.js` (Natural language coaching prompt in Markdown).
  - `analysisController.js` (Cache-first pipeline).

---

### Slice 5: Full UI Integration & Luxury Dark Mode Experience
* **Goal:** Assemble the Fast Analysis dashboard with real-time eval bar, move-order mistake warnings, candidate move stats table, and Markdown coaching insights.
* **Deliverables:**
  - `EvaluationBar.jsx`
  - `CascadeExplorerTable.jsx`
  - `FastAnalysisPanel.jsx` (Markdown rendered with highlight tags)
  - Full end-to-end integration and UX polish.
