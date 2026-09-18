const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// GET /api/health
router.get('/', (req, res) => {
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbState = mongoose.connection.readyState;

  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'AI Chess Opening Explainer Backend',
    version: '1.0.0',
    database: {
      status: dbStatusMap[dbState] || 'unknown',
      stateCode: dbState,
    },
    uptime: process.uptime(),
  });
});

module.exports = router;
