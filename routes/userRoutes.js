const express = require('express');
const { registerUser, getAllUsers, getUserById } = require('../controllers/userController');
const router = express.Router();
const { verifyTokenAndAdmin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.get('/all', verifyTokenAndAdmin, getAllUsers);
router.get('/:id', verifyTokenAndAdmin, getUserById);

module.exports = router;
