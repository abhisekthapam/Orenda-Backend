const User = require('../models/userModel');
const userValidator = require('../validators/userValidators');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        if (!users || users.length === 0) {
            return res.status(204).json({ message: 'No users found' });
        }
        res.status(200).json({ message: 'Users fetched successfully', users });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({
            message: 'User fetched successfully',
            user
        });
    } catch (err) {
        console.error('Error fetching user by ID:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role, phone } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { error } = userValidator.validate({ name, email, password, role, phone });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        if (email && email !== existingUser.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        if (phone && phone !== existingUser.phone) {
            const phoneExists = await User.findOne({ phone });
            if (phoneExists) {
                return res.status(400).json({ message: 'Phone number already in use' });
            }
        }

        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (email) updatedFields.email = email;
        if (password) updatedFields.password = await bcrypt.hash(password, saltRounds);
        if (role) updatedFields.role = role;
        if (phone) updatedFields.phone = phone;

        const updatedUser = await User.findByIdAndUpdate(id, updatedFields, {
            new: true,
            runValidators: true,
        });

        if (!updatedUser) {
            return res.status(500).json({ message: 'Failed to update user' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (err) {
        console.error('Error updating user:', err.message);

        if (err.message.includes('Validation') || err.message.includes('already in use')) {
            return res.status(400).json({ message: err.message });
        }

        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { registerUser, getAllUsers, getUserById, updateUser };
