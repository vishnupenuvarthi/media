import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { UserModel } from '../models/user.model.js';
import { AppError } from '../utils/AppError.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { isDbConnected } from '../config/db.js';

export const registerUser = async ({ name, email, password, role = 'user', categories = [] }) => {
  try {
    // Check database connection first
    if (!isDbConnected() || mongoose.connection.readyState !== 1) {
      throw new AppError('Database connection is not available. Please try again in a moment.', 503);
    }

    // Validate inputs
    if (!name || !name.trim()) {
      throw new AppError('Name is required', 400);
    }
    if (!email || !email.trim()) {
      throw new AppError('Email is required', 400);
    }
    if (!password) {
      throw new AppError('Password is required', 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      throw new AppError('Please provide a valid email address', 400);
    }

    // Check if email already exists
    let existing;
    try {
      existing = await UserModel.findOne({ email: email.toLowerCase().trim() });
    } catch (dbError) {
      console.error('Database error checking existing user:', dbError);
      if (dbError.name === 'MongoNetworkError' || dbError.name === 'MongoServerSelectionError') {
        throw new AppError('Database connection error. Please check your connection and try again.', 503);
      }
      throw dbError;
    }

    if (existing) {
      throw new AppError('Email address is already registered. Please use a different email or try logging in.', 409);
    }

    // Validate password strength
    if (password.length < 6) {
      throw new AppError('Password must be at least 6 characters long', 400);
    }

    // Hash password with bcrypt (10 rounds)
    const passwordHash = await bcrypt.hash(password, 10);

    // Prepare user data
    const userData = {
      email: email.toLowerCase().trim(),
      passwordHash,
      role: role || 'user',
      categories: Array.isArray(categories) ? categories : [],
      profile: { 
        name: name.trim(),
      },
      status: 'active',
      loginAttempts: 0
    };

    console.log('Creating user with data:', { email: userData.email, role: userData.role, categoriesCount: userData.categories.length });

    // Create user with all fields
    let user;
    try {
      user = await UserModel.create(userData);
      console.log('User created successfully:', user._id.toString());
    } catch (createError) {
      console.error('Error creating user:', createError);
      // Handle MongoDB duplicate key error
      if (createError.code === 11000) {
        throw new AppError('Email address is already registered. Please use a different email or try logging in.', 409);
      }
      // Handle validation errors
      if (createError.name === 'ValidationError') {
        const messages = Object.values(createError.errors).map(e => e.message).join(', ');
        throw new AppError(messages || 'Validation error', 400);
      }
      // Handle database connection errors
      if (createError.name === 'MongoNetworkError' || createError.name === 'MongoServerSelectionError') {
        throw new AppError('Database connection error. Please check your connection and try again.', 503);
      }
      throw createError;
    }

    // Return user data with tokens
    return issueTokens(user);
  } catch (error) {
    console.error('registerUser error:', error);
    // If it's already an AppError, re-throw it
    if (error instanceof AppError) {
      throw error;
    }
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      throw new AppError('Email address is already registered. Please use a different email or try logging in.', 409);
    }
    // Handle database connection errors
    if (error.name === 'MongoNetworkError' || error.name === 'MongoServerSelectionError') {
      throw new AppError('Database connection error. Please check your connection and try again.', 503);
    }
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message).join(', ');
      throw new AppError(messages || 'Validation error', 400);
    }
    // Generic error
    throw new AppError(error.message || 'Failed to create account. Please try again.', 500);
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    // Check database connection first
    if (!isDbConnected() || mongoose.connection.readyState !== 1) {
      throw new AppError('Database connection is not available. Please try again in a moment.', 503);
    }

    // Validate inputs
    if (!email || !email.trim()) {
      throw new AppError('Email is required', 400);
    }
    if (!password) {
      throw new AppError('Password is required', 400);
    }

    // Find user by email (case-insensitive)
    let user;
    try {
      user = await UserModel.findOne({ email: email.toLowerCase().trim() });
    } catch (dbError) {
      console.error('Database error finding user:', dbError);
      if (dbError.name === 'MongoNetworkError' || dbError.name === 'MongoServerSelectionError') {
        throw new AppError('Database connection error. Please check your connection and try again.', 503);
      }
      throw dbError;
    }
    
    if (!user) {
      throw new AppError('Invalid email or password. Please check your credentials and try again.', 401);
    }

  // Check if account is locked
  if (user.isLocked) {
    const lockTime = user.lockUntil.getTime() - Date.now();
    throw new AppError(`Account is temporarily locked. Please try again in ${Math.ceil(lockTime / 1000 / 60)} minutes.`, 423);
  }

  // Check if account is suspended
  if (user.status === 'suspended') {
    throw new AppError('Your account has been suspended. Please contact support.', 403);
  }

    // Verify password
    const match = await bcrypt.compare(password, user.passwordHash);
    
    if (!match) {
      // Increment login attempts
      const updates = { $inc: { loginAttempts: 1 } };
      
      // Lock account after 5 failed attempts for 30 minutes
      if (user.loginAttempts + 1 >= 5 && !user.isLocked) {
        updates.$set = { lockUntil: Date.now() + 30 * 60 * 1000 }; // 30 minutes
      }
      
      try {
        await UserModel.findByIdAndUpdate(user._id, updates);
      } catch (updateError) {
        console.error('Error updating login attempts:', updateError);
        // Don't fail login if update fails, just log it
      }
      throw new AppError('Invalid email or password. Please check your credentials and try again.', 401);
    }

    // Reset login attempts and update last login
    try {
      await UserModel.findByIdAndUpdate(user._id, {
        $set: { 
          lastLogin: new Date(),
          loginAttempts: 0,
          lockUntil: null
        }
      });
    } catch (updateError) {
      console.error('Error updating last login:', updateError);
      // Don't fail login if update fails, just log it
    }

    // Update user object for token generation
    user.lastLogin = new Date();
    user.loginAttempts = 0;

    return issueTokens(user);
  } catch (error) {
    console.error('loginUser error:', error);
    // If it's already an AppError, re-throw it
    if (error instanceof AppError) {
      throw error;
    }
    // Handle database connection errors
    if (error.name === 'MongoNetworkError' || error.name === 'MongoServerSelectionError') {
      throw new AppError('Database connection error. Please check your connection and try again.', 503);
    }
    // Generic error
    throw new AppError(error.message || 'Login failed. Please try again.', 500);
  }
};

const issueTokens = (user) => {
  const userId = user._id?.toString() || user.id;
  const payload = { userId, role: user.role };
  return {
    user: {
      id: userId,
      name: user.profile?.name ?? '',
      email: user.email,
      role: user.role,
      categories: user.categories || [],
      status: user.status || 'active',
      lastLogin: user.lastLogin
    },
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload)
  };
};

export const refreshTokens = async (token) => {
  const payload = verifyRefreshToken(token);
  const user = await UserModel.findById(payload.userId);
  if (!user) throw new AppError('User not found', 404);
  return issueTokens(user);
};

