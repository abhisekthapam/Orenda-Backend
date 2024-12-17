const User = require('../models/userModel');
const userValidator = require('../validators/userValidators');

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;

        const { error } = userValidator.validate({ name, email, password, role, phone });
        if (error) throw new Error(error.details[0].message);

        const userExists = await User.findOne({ email });
        if (userExists) throw new Error('Email already in use');

        const phoneExists = await User.findOne({ phone });
        if (phoneExists) throw new Error('Phone number already in use');

        const newUser = new User({ name, email, password, role, phone });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        console.error('Error:', err.message);

        if (err.message.includes('Validation') || err.message.includes('already in use')) {
            return res.status(400).json({ message: err.message });
        }

        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser };
