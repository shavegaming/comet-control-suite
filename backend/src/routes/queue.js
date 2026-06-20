// queue.js (Roblox Polling)
const express = require('express');
const router = express.Router();
const queue = require('../services/queueService');

router.get('/poll', (req, res) => {
    // Return max 5 actions per poll to prevent Roblox timeout
    const actions = queue.drain(5); 
    res.json(actions);
});

module.exports = router;
