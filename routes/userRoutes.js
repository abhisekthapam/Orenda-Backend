const express = require('express');
const { registerUser, getAllUsers } = require('../controllers/userController');
const router = express.Router();
const { verifyTokenAndAdmin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.get('/all', verifyTokenAndAdmin, getAllUsers);

module.exports = router;
