import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';
export const authenticate = (req, _res, next) => {
    const header = req.headers.authorization;
    if (!header) {
        throw new AppError('Missing authorization header', 401);
    }
    const token = header.replace('Bearer ', '');
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
};
export const authorize = (roles) => (req, _res, next) => {
    if (!req.user) {
        throw new AppError('Unauthorized', 401);
    }
    if (!roles.includes(req.user.role)) {
        throw new AppError('Forbidden', 403);
    }
    next();
};
