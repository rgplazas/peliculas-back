const express = require('express');
const router = express.Router();
const { createUser, updateUser, deleteUser, getAllUsers, getUserById, login } = require('../controllers/UserController');
const { authenticateToken } = require('../middlewares/auth');

router.post('/register', createUser);
router.post('/login', login);
router.get('/users', authenticateToken, getAllUsers);
router.get('/users/:userId', authenticateToken, getUserById);
router.put('/users/:userId', authenticateToken, updateUser);
router.delete('/users/:userId', authenticateToken, deleteUser);


module.exports = router;