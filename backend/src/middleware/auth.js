const crypto = require('crypto');

exports.verifyHMAC = (req, res, next) => {
    // Allow Roblox to bypass HMAC if using IP whitelist, but HMAC is preferred
    if (req.path.startsWith('/queue') && req.headers['x-roblox-secret'] === process.env.ROBLOX_SECRET) {
        return next();
    }

    const signature = req.headers['x-comet-signature'];
    const timestamp = req.headers['x-comet-timestamp'];
    
    if (!signature || !timestamp) return res.status(401).json({ error: 'Missing auth headers' });

    // Prevent replay attacks (5 min window)
    if (Math.abs(Date.now() - parseInt(timestamp)) > 300000) {
        return res.status(401).json({ error: 'Timestamp expired' });
    }

    const payload = timestamp + JSON.stringify(req.body);
    const hmac = crypto.createHmac('sha256', process.env.SHARED_SECRET).update(payload).digest('hex');

    if (hmac !== signature) return res.status(403).json({ error: 'Invalid signature' });
    next();
};
