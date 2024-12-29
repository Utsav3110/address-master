import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Generate Access and Refresh Tokens
const generateAccessandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error('Something went wrong while generating tokens');
  }
};

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;

    if (!username || !fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: 'Please provide a valid email address.' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Username or email already exists.' });
    }

    const user = await User.create({
      username,
      fullName,
      email,
      password,
    });

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(
      user._id
    );

    res
      .status(201)
      .cookie('accessToken', accessToken, { httpOnly: true, secure: true })
      .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
      .json({
        message: 'User registered successfully.',
        user: { _id : user._id, username, fullName, email },
      });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// User login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password.trim());
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(
      user._id
    );

    res
      .status(200)
      .cookie('accessToken', accessToken, { httpOnly: true, secure: true })
      .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
      .json({
        message: 'Login successful.',
        user: {
          _id : user._id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
        },
      });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};


export const logoutUser = async (req, res) => {
  try {
    res
      .clearCookie('accessToken', { httpOnly: true, secure: true })
      .clearCookie('refreshToken', { httpOnly: true, secure: true })
      .status(200)
      .json({ message: 'Logout successful.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};


export const getCurrentUser = async(req, res)=>{
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
}
