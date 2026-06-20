require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { verifyHMAC } = require('./middleware/auth');
const apiRoutes = require('./routes/api');
const queueRoutes = require('./routes/queue');

const app = express();
app.use(cors());
app.use(express.json());

// Rate limiting (simple in-memory for demo, use Redis in prod)
const rateLimit = require('express-rate-limit');
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use('/api', verifyHMAC, apiRoutes);
app.use('/queue', verifyHMAC, queueRoutes); // Roblox polls this

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Comet Backend running on port ${PORT}`));
