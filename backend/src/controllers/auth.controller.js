import { asyncHandler } from '../utils/asyncHandler.js';
import { loginUser, refreshTokens, registerUser } from '../services/auth.service.js';

export const register = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, role, categories } = req.body;
    
    // Log incoming request for debugging
    console.log('Registration attempt:', { name, email, role, categoriesCount: categories?.length || 0 });
    
    const result = await registerUser({ name, email, password, role, categories });
    
    console.log('Registration successful for:', email);
    
    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Bharat Bulletin.',
      ...result
    });
  } catch (error) {
    console.error('Registration error:', error);
    throw error; // Re-throw to be handled by asyncHandler
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser({ email, password });
  res.json({
    success: true,
    message: 'Login successful! Welcome back.',
    ...result
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await refreshTokens(refreshToken);
  res.json(result);
});

export const logout = asyncHandler(async (_req, res) => {
  res.status(204).send();
});

