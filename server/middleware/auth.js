const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Get token from header
    const authHeader = req.header('Authorization');

    // Check for header
    if (!authHeader) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Check if the token is in the 'Bearer <token>' format
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ msg: 'Token format is "Bearer <token>"' });
    }
    
    const token = tokenParts[1];

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};