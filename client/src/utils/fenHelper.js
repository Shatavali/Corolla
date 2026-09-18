/**
 * FEN Normalization Utility for AI Chess Opening Explainer
 * Drops halfmove clock and fullmove number to normalize move-order transpositions.
 *
 * Full FEN:   "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
 * Normalized: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -"
 *
 * @param {string} fen - Full or partial FEN string
 * @returns {string} 4-field normalized FEN (board activeColor castling enPassant)
 */
export function normalizeFen(fen) {
  if (!fen || typeof fen !== 'string') return '';
  const parts = fen.trim().split(/\s+/);
  return parts.slice(0, 4).join(' ');
}

/**
 * Validates a FEN string using chess.js
 * @param {string} fen
 * @param {typeof import('chess.js').Chess} ChessConstructor
 * @returns {boolean}
 */
export function isValidFen(fen, ChessConstructor) {
  if (!fen || typeof fen !== 'string') return false;
  try {
    const tempGame = new ChessConstructor();
    tempGame.load(fen.trim());
    return true;
  } catch (err) {
    return false;
  }
}
