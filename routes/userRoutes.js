const express = require('express');
const { registerUser, getAllUsers, getUserById, updateUser, uploadProfileImage } = require('../controllers/userController');
const router = express.Router();
const { verifyTokenAndAdmin } = require('../middleware/authMiddleware');
const { uploadProfileImage: uploadMiddleware } = require('../middleware/uploadMiddleware');

router.post('/register', registerUser);
router.post('/upload-profile-image', uploadMiddleware, uploadProfileImage);
router.get('/all', verifyTokenAndAdmin, getAllUsers);
router.get('/:id', verifyTokenAndAdmin, getUserById);
router.put('/:id', verifyTokenAndAdmin, updateUser);

module.exports = router;
