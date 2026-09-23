import { getUserFromToken } from '../services/auth.service.js';

export async function authenticate(req, _res, next) {
    const authorization = req.headers.authorization || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';

    if (!token) {
        const error = new Error('Authentication is required.');
        error.statusCode = 401;
        return next(error);
    }

    const user = await getUserFromToken(token);

    if (!user) {
        const error = new Error('Your session is invalid or has expired.');
        error.statusCode = 401;
        return next(error);
    }

    req.user = user;
    return next();
}
