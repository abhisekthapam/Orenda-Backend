const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    username: { type: String, unique: true },
    role: {
        type: String,
        enum: ['admin', 'user', 'waiter', 'chef'],
        default: 'user',
    },
    createdAt: { type: Date, default: Date.now },
    loginHistory: [
        {
            device: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
            ipAddress: { type: String, required: true },
        },
    ],
});

userSchema.methods.addLoginDetails = async function (deviceDetails) {
    try {
        if (!deviceDetails?.type || !deviceDetails?.ipAddress) {
            throw new Error('Device details or required properties (type, ipAddress) are missing');
        }

        this.loginHistory.push({
            device: deviceDetails.type,
            timestamp: Date.now(),
            ipAddress: deviceDetails.ipAddress,
        });

        await this.save();
    } catch (err) {
        console.error('Error in addLoginDetails:', err.message);
        throw new Error(`Error adding login details: ${err.message}`);
    }
};

userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) return next();

        if (!this.username) {
            this.username = await generateUniqueUsername();
        }

        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        console.error('Error in pre-save:', err.message);
        next(err);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const generateUniqueUsername = async () => {
    const symbols = '@#%&!';
    const numbers = '0123456789';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';

    const getRandomString = (length, chars) => {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const generateUsername = () => {
        const randomSymbols = getRandomString(4, symbols);
        const randomNumbers = getRandomString(4, numbers);
        const randomUppercase = getRandomString(4, uppercase);
        const randomLowercase = getRandomString(4, lowercase);

        const usernameParts = [randomSymbols, randomNumbers, randomUppercase, randomLowercase];
        let username = usernameParts.join('');
        username = username.split('').sort(() => Math.random() - 0.5).join(''); 
        return username.substring(0, 16);
    };

    let username = generateUsername();
    let existingUser = await mongoose.model('User').findOne({ username });

    let attempts = 0;
    while (existingUser && attempts < 5) {
        username = generateUsername();
        existingUser = await mongoose.model('User').findOne({ username });
        attempts++;
    }

    if (attempts >= 5) {
        throw new Error(`Failed to generate a unique username after ${attempts} attempts`);
    }

    return username;
};

module.exports = mongoose.model('User', userSchema);
