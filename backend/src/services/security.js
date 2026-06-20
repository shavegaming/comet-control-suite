// In-memory stores (Use Redis/DB in production)
const warnings = new Map(); // userId -> count
const blacklistedUsers = new Set(); 
const codeBlacklist = [
    'game:Shutdown()', 'os.execute', 'loadstring', 'getfenv', 'setfenv', 
    'require(game.', 'HttpGet', 'http.request', 'shell', 'io.popen'
];

exports.checkBlacklist = (userId, code) => {
    if (blacklistedUsers.has(userId)) return { blocked: true, reason: 'User is globally blacklisted.' };
    
    const lowerCode = code.toLowerCase();
    for (const bad of codeBlacklist) {
        if (lowerCode.includes(bad.toLowerCase())) {
            const currentWarnings = (warnings.get(userId) || 0) + 1;
            warnings.set(userId, currentWarnings);
            
            if (currentWarnings >= 10) {
                blacklistedUsers.add(userId);
                return { blocked: true, reason: 'Blacklisted code detected. 10 warnings reached. User is now blacklisted.' };
            }
            return { blocked: true, reason: `Blacklisted code detected. Warning ${currentWarnings}/10.` };
        }
    }
    return { blocked: false };
};
