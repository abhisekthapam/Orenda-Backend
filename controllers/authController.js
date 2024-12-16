const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { jwtSecret } = require('../config/jwtConfig');

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials: User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials: Password does not match' });
        }

        const payload = {
            userId: user._id,
            username: user.username,
        };

        let token;
        try {
            token = jwt.sign(payload, jwtSecret, { expiresIn: '16h' });
        } catch (err) {
            console.error('JWT Signing Error:', err);
            return res.status(500).json({ message: 'Error generating token' });
        }

        const deviceDetails = {
            type: req.headers['user-agent'],
            ipAddress: req.ip,
        };

        try {
            await user.addLoginDetails(deviceDetails);
        } catch (err) {
            console.error('Error adding login details:', err);
            return res.status(500).json({ message: 'Error adding login details' });
        }

        res.json({ token, loginHistory: user.loginHistory });
    } catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { loginUser };
