const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Authorization token required.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Your JWT secret
        req.user = decoded; // Attach decoded user info to request
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = { verifyToken };
