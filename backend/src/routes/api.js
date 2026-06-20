// api.js
const express = require('express');
const router = express.Router();
const { checkBlacklist } = require('../services/security');
const queue = require('../services/queueService');

router.post('/action', (req, res) => {
    const { userId, action, target, data } = req.body;
    
    if (action === 'Execute') {
        const check = checkBlacklist(userId, data.code);
        if (check.blocked) return res.status(403).json(check);
    }

    queue.push({ id: Date.now().toString(), action, target, data, timestamp: Date.now() });
    res.json({ success: true, message: 'Action queued.' });
});

router.get('/players', (req, res) => res.json(queue.getPlayers()));
router.get('/status', (req, res) => res.json(queue.getStatus()));

module.exports = router;
