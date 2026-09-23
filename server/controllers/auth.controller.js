import { loginUser, registerUser } from '../services/auth.service.js';

export async function postRegister(req, res) {
    const result = await registerUser(req.validatedBody);
    res.status(201).json(result);
}

export async function postLogin(req, res) {
    const result = await loginUser(req.validatedBody);
    res.json(result);
}

export async function getCurrentUser(req, res) {
    return res.json({ user: req.user });
}

export function postLogout(_req, res) {
    res.json({
        message: 'Logged out successfully.',
    });
}
