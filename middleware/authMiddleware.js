const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const verifyTokenAndAdmin = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Permission denied, only admins are allowed' });
        }

        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            console.error('JWT error: Invalid or malformed token:', err.message);
            return res.status(401).json({ message: 'Invalid or malformed token' });
        }

        if (err.name === 'TokenExpiredError') {
            console.error('JWT error: Token has expired:', err.message);
            return res.status(401).json({ message: 'Token has expired' });
        }

        if (err.name === 'NotBeforeError') {
            console.error('JWT error: Token not active:', err.message);
            return res.status(401).json({ message: 'Token is not active yet' });
        }

        console.error('Error in token verification:', err.message);
        return res.status(500).json({ message: 'Server error during token verification' });
    }
};

module.exports = { verifyTokenAndAdmin };
