import { asyncHandler } from '../utils/asyncHandler.js';
import { loginUser, refreshTokens, registerUser } from '../services/auth.service.js';
export const register = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;
    const result = await registerUser({ name, email, password, role });
    res.status(201).json(result);
});
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    res.json(result);
});
export const refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await refreshTokens(refreshToken);
    res.json(result);
});
