import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
  getCurrentUser
} from '../controllers/user.controller.js';
import {verifyJWT} from '../middlewares/auth.middlewares.js';

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// User login
router.post('/login', loginUser);

router.post('/logout', verifyJWT , logoutUser)

router.get('/current-user', verifyJWT , getCurrentUser)

// Get user profile (protected route)
router.get('/profile', verifyJWT, getUserProfile);

export default router;
