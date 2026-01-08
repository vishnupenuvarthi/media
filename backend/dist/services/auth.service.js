import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
export const registerUser = async ({ name, email, password, role = 'reader' }) => {
    const existing = await UserModel.findOne({ email });
    if (existing) {
        throw new AppError('Email already in use', 409);
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ name, email, passwordHash, role });
    return issueTokens(user);
};
export const loginUser = async ({ email, password }) => {
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new AppError('Invalid credentials', 401);
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match)
        throw new AppError('Invalid credentials', 401);
    return issueTokens(user);
};
const issueTokens = (user) => {
    const payload = { userId: user.id, role: user.role };
    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        accessToken: signAccessToken(payload),
        refreshToken: signRefreshToken(payload)
    };
};
export const refreshTokens = async (token) => {
    const payload = verifyRefreshToken(token);
    const user = await UserModel.findById(payload.userId);
    if (!user)
        throw new AppError('User not found', 404);
    return issueTokens(user);
};
