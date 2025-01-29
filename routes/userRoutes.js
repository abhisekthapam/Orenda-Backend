const express = require('express');
const { registerUser, getAllUsers, getUserById, updateUser } = require('../controllers/userController');
const router = express.Router();
const { verifyTokenAndAdmin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);

router.get('/all', verifyTokenAndAdmin, getAllUsers);
router.get('/:id', verifyTokenAndAdmin, getUserById);
router.put('/:id', verifyTokenAndAdmin, updateUser);

module.exports = router;
