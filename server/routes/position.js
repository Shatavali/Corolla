const express = require('express');
const router = express.Router();

/**
 * GET /api/position
 * Receives normalized 4-field FEN query parameter from the client,
 * logs it to the server console, and returns JSON confirmation.
 */
router.get('/', (req, res) => {
  const { fen } = req.query;

  if (!fen) {
    return res.status(400).json({
      status: 'error',
      message: 'Query parameter "fen" is required.',
    });
  }

  // Log the normalized FEN to the terminal
  console.log(`[Position API] Normalized FEN received: "${fen}"`);

  // Return temporary JSON response as per Slice 2 specification
  return res.json({
    status: 'success',
    fen: fen,
  });
});

module.exports = router;
