import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';

export const authenticate = (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      throw new AppError('Missing authorization header', 401);
    }
    const token = header.replace('Bearer ', '');
    if (!token) {
      throw new AppError('Token not provided', 401);
    }
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Invalid or expired token', 401);
  }
};

export const authorize = (roles) => (req, _res, next) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401);
  }
  if (!roles.includes(req.user.role)) {
    throw new AppError(`Access denied. Required roles: ${roles.join(', ')}`, 403);
  }
  next();
};

// Role hierarchy helper
export const hasRole = (userRole, requiredRole) => {
  const hierarchy = { owner: 4, employer: 3, developer: 2, user: 1 };
  return hierarchy[userRole] >= hierarchy[requiredRole];
};

