const Joi = require('joi');

const userValidator = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'user', 'waiter', 'chef').optional(),
});

module.exports = userValidator;
