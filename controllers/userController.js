const User = require('../models/userModel');
const userValidator = require('../validators/userValidators');

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const { error } = userValidator.validate({ name, email, password, role });
        if (error) {
            console.error('Validation Error:', error.details[0].message);
            return res.status(400).json({ message: error.details[0].message });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            console.error('User already exists:', email);
            return res.status(400).json({ message: 'Email already in use' });
        }

        const newUser = new User({ name, email, password, role });

        try {
            await newUser.save();
        } catch (err) {
            console.error('Error saving user:', err);
            return res.status(500).json({ message: 'Failed to create user. Please try again later.' });
        }

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser };
