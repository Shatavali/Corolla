import { useState, useMemo, useCallback } from 'react';
import { Chess } from 'chess.js';

/**
 * Computes a Map<square, square[]> of all legal destinations
 * for the current side to move. This is the format chessground
 * expects for `movable.dests`.
 */
function calcDests(game) {
  const dests = new Map();
  const SQUARES = [
    'a1','b1','c1','d1','e1','f1','g1','h1',
    'a2','b2','c2','d2','e2','f2','g2','h2',
    'a3','b3','c3','d3','e3','f3','g3','h3',
    'a4','b4','c4','d4','e4','f4','g4','h4',
    'a5','b5','c5','d5','e5','f5','g5','h5',
    'a6','b6','c6','d6','e6','f6','g6','h6',
    'a7','b7','c7','d7','e7','f7','g7','h7',
    'a8','b8','c8','d8','e8','f8','g8','h8',
  ];

  for (const s of SQUARES) {
    const moves = game.moves({ square: s, verbose: true });
    if (moves.length > 0) {
      dests.set(s, moves.map((m) => m.to));
    }
  }
  return dests;
}

const INITIAL_FEN = new Chess().fen();

export function useChessGame() {
  // Timeline state: history array of FEN strings + index pointer
  const [history, setHistory] = useState([INITIAL_FEN]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [boardOrientation, setBoardOrientation] = useState('white');

  // The active FEN is always derived from the timeline pointer
  const fen = history[currentMoveIndex];

  // Build a temporary Chess instance from the active FEN for validation/derivation
  const activeGame = useMemo(() => new Chess(fen), [fen]);

  // Derive turn color in the format chessground expects
  const turnColor = activeGame.turn() === 'w' ? 'white' : 'black';

  // Legal move destinations — only available when viewing the latest position
  const isAtLatest = currentMoveIndex === history.length - 1;
  const dests = useMemo(() => {
    if (!isAtLatest) return new Map(); // No moves allowed when browsing history
    return calcDests(activeGame);
  }, [fen, isAtLatest]);

  /**
   * Called by chessground when a piece is dropped.
   * Lichess-style branching: if user goes back and plays a new move,
   * the old future is overwritten.
   */
  const onMove = useCallback((orig, dest) => {
    try {
      const tempGame = new Chess(fen);
      const move = tempGame.move({
        from: orig,
        to: dest,
        promotion: 'q', // Always promote to queen for UI fluidity
      });

      if (move) {
        const newFen = tempGame.fen();
        // Slice history to current point (branch off), then append new position
        setHistory((prev) => {
          const sliced = prev.slice(0, currentMoveIndex + 1);
          return [...sliced, newFen];
        });
        setCurrentMoveIndex((prev) => prev + 1);
      }
    } catch (e) {
      console.warn('[useChessGame] Move rejected:', orig, dest, e.message);
    }
  }, [fen, currentMoveIndex]);

  // ─── Timeline Navigation (Lichess-style) ──────────────────────────

  function goToStart() {
    setCurrentMoveIndex(0);
  }

  function goBack() {
    setCurrentMoveIndex((prev) => Math.max(0, prev - 1));
  }

  function goForward() {
    setCurrentMoveIndex((prev) => Math.min(history.length - 1, prev + 1));
  }

  function goToEnd() {
    setCurrentMoveIndex(history.length - 1);
  }

  // ─── Utility Functions ────────────────────────────────────────────

  function resetGame() {
    setHistory([INITIAL_FEN]);
    setCurrentMoveIndex(0);
  }

  function flipBoard() {
    setBoardOrientation((prev) => (prev === 'white' ? 'black' : 'white'));
  }

  function copyFen() {
    navigator.clipboard.writeText(fen);
    alert('FEN copied to clipboard!');
  }

  return {
    fen,
    turnColor,
    dests,
    boardOrientation,
    isAtLatest,
    currentMoveIndex,
    totalMoves: history.length - 1,
    onMove,
    goToStart,
    goBack,
    goForward,
    goToEnd,
    resetGame,
    flipBoard,
    copyFen,
  };
}
