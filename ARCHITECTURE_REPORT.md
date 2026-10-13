# Architecture Analysis Report: Corolla Chess

## 1. Evaluation of Current Architecture & Folder Structure

**Correction on Framework Stack:** The prompt mentioned evaluating the "Next.js App Router" file and folder structure. However, an analysis of the repository reveals that the project is built using a **MERN Stack** (MongoDB, Express, React, Node.js) with a clean separation of concerns, utilizing **React + Vite** for the frontend rather than Next.js.

### Current Structure Breakdown
*   **Monorepo Pattern:** The root contains isolated `client/` and `server/` directories.
*   **Client (`/client`):**
    *   Powered by Vite, React 19, and Tailwind CSS v4.
    *   Folder structure currently houses basic React scaffolding (`src/components`, `src/hooks`, `src/utils`, `src/data`).
    *   `src/App.jsx` outlines a high-level UI structure (`Header`, `SidebarLeft`, `CenterCanvas`, `SidebarRight`, `StatusBar`), aligning with the "Luxury Dark Mode" requirement from the specification.
*   **Server (`/server`):**
    *   Powered by Express.js and Node.js.
    *   Currently structured with `/routes` (e.g., `health.js`, `position.js`) and `/config` (e.g., `db.js`).
    *   Includes security/utility middleware like Helmet, CORS, and Morgan.
*   **System Documents:** `gemini.md` and `task_plan.md` clearly lay out the "Constitution" and "Vertical Slices", acting as the architectural source of truth. The strict adherence to the 4-field normalized FEN system is highly structured and well-documented.

## 2. Integration Readiness: Client-Side Chess Library & Backend AI Routing

**Conclusion: Highly Ready.** The setup is inherently designed and explicitly prepared for both.

*   **Client-Side `chess.js` Integration:**
    *   `chess.js` (v1.4.0) and `@react-chess/chessground` are already present in the `client/package.json` dependencies.
    *   According to `task_plan.md`, "Slice 2: Board State & Move Validation" is marked as COMPLETED, indicating that `chess.js` is already actively being used for strict move validation and 4-field FEN normalization on the client side.
*   **Backend Routing for AI Explanations:**
    *   The backend is fully prepared to handle AI explanations. The `/api/position` route is established.
    *   The `gemini.md` specification defines a robust pipeline where the backend normalizes the FEN, checks MongoDB (`AIExplanation` cache), consults the Lichess Cascade Explorer, and then invokes the LLM Engine.
    *   Mongoose schemas for `OpeningPosition` and `AIExplanation` are explicitly mapped out in the docs and ready to be physically modeled in the backend.

## 3. Recommendations for Future Folder Structures

To support the transition into Slices 3, 4, and 5 (LLM Integration, Cascade Explorer, full UI), the following folder structures should be established:

### Client Recommendations (`/client/src/`)
*   **`/types`:** Even if not strictly using TypeScript, define JSDoc or `.d.ts` files here for data structures like the Fast Analysis Payload, Normalized FEN strings, and Move Stats to ensure consistency.
*   **`/services` or `/api`:** Abstract all `fetch` calls to the Express backend here (e.g., `api/positionApi.js`) to decouple UI components from network logic.
*   **`/components/board`:** Group `ChessBoard.jsx`, `EvaluationBar.jsx`, and any pieces/squares logic.
*   **`/components/analysis`:** House the `FastAnalysisPanel.jsx`, `CascadeExplorerTable.jsx`, and `MoveNotationTree.jsx`.
*   **`/store` or `/context`:** As the app grows, lift the board state and AI analysis responses into a global context or state manager (Zustand/Redux) to share between the Board and the Analysis Panel easily.

### Server Recommendations (`/server/`)
*   **`/models`:** Immediately implement the Mongoose schemas defined in `gemini.md` (`OpeningPosition.js`, `AIExplanation.js`, `EvaluationCache.js`).
*   **`/services`:** This will be the most critical folder for the "engine" modules. It should contain:
    *   `lichessService.js` (for Cascade API and Cloud Eval).
    *   `llmService.js` (for interacting with the chosen LLM provider to generate the Markdown explanations).
    *   `moveOrderAnalyzer.js` (for calculating the algorithmic eval delta).
*   **`/controllers`:** Move the business logic out of the `/routes` files. E.g., `analysisController.js` will orchestrate the caching, Lichess fetch, and LLM generation pipeline as described in the specs.
*   **`/utils/fen.js`:** Share the 4-field FEN normalization logic here so the backend can independently verify or sanitize incoming FEN strings before database queries.
