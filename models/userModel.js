const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const ROLE_TYPES = ['admin', 'user', 'waiter', 'chef'];

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    username: { type: String, unique: true },
    role: {
        type: String,
        enum: ROLE_TYPES,
        default: 'user',
    },
    phone: { type: String, unique: true },
    profileImage: { type: String },
    createdAt: { type: Date, default: Date.now },
    loginHistory: [
        {
            device: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
            ipAddress: { type: String, required: true },
        },
    ],
});

userSchema.methods.addLoginDetails = async function ({ type, ipAddress }) {
    if (!type || !ipAddress) {
        throw new Error('Device details (type, ipAddress) are required');
    }

    this.loginHistory.push({ device: type, ipAddress });
    await this.save();
};

userSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        if (!this.username) {
            this.username = `${this.name || 'user'}_${uuidv4().slice(0, 8)}`;
        }
        next();
    } catch (err) {
        console.error('Error in pre-save hook:', err.message);
        next(err);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
