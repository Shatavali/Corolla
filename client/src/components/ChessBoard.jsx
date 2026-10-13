import React, { useState, useEffect, useCallback } from 'react';
import { Chess, SQUARES } from 'chess.js';
import Chessground from './Chessground';
import { normalizeFen } from '../utils/fenHelper';

export default function ChessBoard() {
  // Initialize Chess.js engine instance
  const [game, setGame] = useState(() => new Chess());
  const [boardOrientation, setBoardOrientation] = useState('white');
  const [copied, setCopied] = useState(false);
  const [pasteModalOpen, setPasteModalOpen] = useState(false);
  const [pastedFenInput, setPastedFenInput] = useState('');
  const [pasteError, setPasteError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync position to Express backend
  const syncPositionWithBackend = useCallback(async (normFen) => {
    setIsSyncing(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/position?fen=${encodeURIComponent(normFen)}`
      );
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const data = await response.json();
      setApiResponse({ success: true, data, timestamp: new Date().toLocaleTimeString() });
    } catch (err) {
      console.warn('[ChessBoard] Position sync error:', err.message);
      setApiResponse({ success: false, error: err.message, timestamp: new Date().toLocaleTimeString() });
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Initial sync on mount
  useEffect(() => {
    const initialNormalized = normalizeFen(game.fen());
    syncPositionWithBackend(initialNormalized);
  }, [syncPositionWithBackend]);

  // Strict Move Validation
  function onPieceDrop(sourceSquare, targetSquare, piece) {
    try {
      const newGame = new Chess(game.fen());
      
      // Auto-promote to Queen if reaching the final rank
      const isPromotion = 
        (piece?.startsWith('wP') && targetSquare.endsWith('8')) ||
        (piece?.startsWith('bP') && targetSquare.endsWith('1'));

      const move = newGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: isPromotion ? 'q' : undefined,
      });

      // chess.js returns null on illegal move in some versions, throws error in others
      if (move === null) {
        return false;
      }

      // Legal move accepted
      setGame(newGame);
      const normalized = normalizeFen(newGame.fen());
      syncPositionWithBackend(normalized);
      return true;
    } catch (error) {
      // Illegal move caught: return false to trigger piece snap-back
      return false;
    }
  }

  // 1. Undo Move
  const handleUndo = () => {
    const newGame = new Chess(game.fen());
    const undoResult = newGame.undo();
    if (undoResult) {
      setGame(newGame);
      const normalized = normalizeFen(newGame.fen());
      syncPositionWithBackend(normalized);
    }
  };

  // 2. Reset Board
  const handleReset = () => {
    const newGame = new Chess();
    setGame(newGame);
    const normalized = normalizeFen(newGame.fen());
    syncPositionWithBackend(normalized);
  };

  // 3. Flip Board
  const handleFlip = () => {
    setBoardOrientation((prev) => (prev === 'white' ? 'black' : 'white'));
  };

  // 4. Copy FEN
  const handleCopyFen = async () => {
    try {
      await navigator.clipboard.writeText(game.fen());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy FEN:', err);
    }
  };

  // 5. Paste FEN with Strict Validation
  const handlePasteSubmit = (e) => {
    e.preventDefault();
    setPasteError(null);
    const cleanFen = pastedFenInput.trim();

    if (!cleanFen) {
      setPasteError('Please enter a FEN string.');
      return;
    }

    try {
      const newGame = new Chess();
      newGame.load(cleanFen); // Throws error if invalid FEN

      setGame(newGame);
      const normalized = normalizeFen(newGame.fen());
      syncPositionWithBackend(normalized);
      setPasteModalOpen(false);
      setPastedFenInput('');
    } catch (err) {
      setPasteError('Invalid FEN format. Please provide a valid 6-field chess FEN.');
    }
  };

  // Game Status Details
  const isGameOver = game.isGameOver();
  const isCheck = game.inCheck();
  const turnColor = game.turn() === 'w' ? 'White' : 'Black';
  const currentFen = game.fen();
  const currentNormalizedFen = normalizeFen(currentFen);
  const moveHistory = game.history();

  return (
    <div className="chessboard-module">
      <div className="chessboard-layout">
        {/* Left / Center: The Chessboard & Controls */}
        <div className="board-container-wrapper">
          {/* Status Header */}
          <div className="board-top-bar">
            <div className="turn-indicator">
              <span className={`turn-dot ${game.turn() === 'w' ? 'white-turn' : 'black-turn'}`} />
              <span className="turn-text">
                {isGameOver
                  ? game.isCheckmate()
                    ? `Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins`
                    : 'Game Over (Draw)'
                  : `${turnColor} to Move`}
              </span>
              {isCheck && !isGameOver && <span className="check-tag">CHECK</span>}
            </div>

            <div className="move-count-badge">
              Ply: {moveHistory.length} • Moves: {Math.ceil(moveHistory.length / 2)}
            </div>
          </div>

          {/* Chessboard Viewport */}
          <div className="board-viewport" style={{ width: '100%', maxWidth: '600px', margin: '0 auto', aspectRatio: '1/1' }}>
            <Chessground
              config={{
                fen: game.fen(),
                orientation: boardOrientation,
                turnColor: game.turn() === 'w' ? 'white' : 'black',
                movable: {
                  color: game.turn() === 'w' ? 'white' : 'black',
                  free: false,
                  dests: (() => {
                    const dests = new Map();
                    SQUARES.forEach(s => {
                      const ms = game.moves({square: s, verbose: true});
                      if (ms.length) dests.set(s, ms.map(m => m.to));
                    });
                    return dests;
                  })()
                }
              }}
              onMove={onPieceDrop}
            />
          </div>

          {/* 5 UI Action Buttons */}
          <div className="board-controls-panel">
            <button
              id="btn-undo"
              className="ctrl-btn"
              onClick={handleUndo}
              disabled={moveHistory.length === 0}
              title="Undo last move"
            >
              <span className="ctrl-icon">↩</span> Undo Move
            </button>

            <button
              id="btn-reset"
              className="ctrl-btn"
              onClick={handleReset}
              title="Reset board to start position"
            >
              <span className="ctrl-icon">🔄</span> Reset Board
            </button>

            <button
              id="btn-flip"
              className="ctrl-btn"
              onClick={handleFlip}
              title="Flip board view"
            >
              <span className="ctrl-icon">🔃</span> Flip Board
            </button>

            <button
              id="btn-copy-fen"
              className="ctrl-btn"
              onClick={handleCopyFen}
              title="Copy 6-field FEN to clipboard"
            >
              <span className="ctrl-icon">{copied ? '✓' : '📋'}</span>
              {copied ? 'Copied!' : 'Copy FEN'}
            </button>

            <button
              id="btn-paste-fen"
              className="ctrl-btn highlight"
              onClick={() => {
                setPasteError(null);
                setPasteModalOpen(true);
              }}
              title="Paste custom FEN string"
            >
              <span className="ctrl-icon">📥</span> Paste FEN
            </button>
          </div>
        </div>

        {/* Right: State Inspector, FEN Normalization & Backend Telemetry */}
        <div className="board-telemetry-panel">
          {/* FEN Normalization Card */}
          <div className="telemetry-card">
            <div className="telemetry-card-header">
              <span className="telemetry-title">🎯 4-Field FEN Normalization</span>
              <span className="spec-badge">CRITICAL SPEC</span>
            </div>
            <p className="telemetry-desc">
              Drops halfmove clock & fullmove number to unify move-order transpositions.
            </p>
            <div className="fen-box">
              <div className="fen-label">Normalized FEN (Sent to Backend):</div>
              <div className="fen-code-block active">{currentNormalizedFen}</div>
            </div>
            <div className="fen-box" style={{ marginTop: '0.75rem' }}>
              <div className="fen-label">Raw 6-Field FEN:</div>
              <div className="fen-code-block muted">{currentFen}</div>
            </div>
          </div>

          {/* Express Backend Telemetry Card */}
          <div className="telemetry-card">
            <div className="telemetry-card-header">
              <span className="telemetry-title">📡 Position API Sync</span>
              <span className={`status-badge ${apiResponse?.success ? 'online' : 'offline'}`}>
                <span className={`status-dot ${apiResponse?.success ? 'online' : 'offline'}`} />
                {isSyncing ? 'SYNCING...' : apiResponse?.success ? '200 OK' : 'FAILED'}
              </span>
            </div>
            <div className="telemetry-endpoint">
              <code>GET /api/position?fen={encodeURIComponent(currentNormalizedFen)}</code>
            </div>
            {apiResponse && (
              <div className="api-response-preview">
                <div className="response-row">
                  <span className="label">Last Synced:</span>
                  <span className="val">{apiResponse.timestamp}</span>
                </div>
                <div className="response-row">
                  <span className="label">Backend Payload:</span>
                  <span className="val json">
                    {JSON.stringify(apiResponse.data || { error: apiResponse.error }, null, 2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Move History Strip */}
          <div className="telemetry-card">
            <div className="telemetry-card-header">
              <span className="telemetry-title">📜 Move History</span>
              <span className="count-pill">{moveHistory.length} plies</span>
            </div>
            <div className="move-history-scroll">
              {moveHistory.length === 0 ? (
                <div className="no-moves">No moves made yet. Make a move on the board!</div>
              ) : (
                <div className="move-chips">
                  {moveHistory.map((m, idx) => (
                    <span key={idx} className={`move-chip ${idx % 2 === 0 ? 'white-move' : 'black-move'}`}>
                      {idx % 2 === 0 ? `${Math.floor(idx / 2) + 1}. ` : ''}
                      {m}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Paste FEN Modal */}
      {pasteModalOpen && (
        <div className="modal-backdrop" onClick={() => setPasteModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Paste Custom FEN</h3>
              <button className="modal-close" onClick={() => setPasteModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handlePasteSubmit}>
              <p className="modal-desc">
                Enter a standard 6-field FEN position. The engine will strictly validate it via try/catch before updating the board.
              </p>
              <textarea
                className="fen-input-field"
                rows={3}
                placeholder="e.g. rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2"
                value={pastedFenInput}
                onChange={(e) => setPastedFenInput(e.target.value)}
                autoFocus
              />
              {pasteError && <div className="modal-error-alert">{pasteError}</div>}
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setPasteModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm">
                  Validate &amp; Load Position
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
