import { ZodError } from 'zod';

export function errorHandler(error, _req, res, _next) {
    if (error instanceof ZodError) {
        return res.status(400).json({
            message: error.issues[0]?.message || 'Request validation failed.',
            issues: error.issues,
        });
    }

    if (error.name === 'CastError') {
        return res.status(400).json({
            message: 'Invalid project identifier.',
        });
    }

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        message: error.message || 'Internal server error.',
    });
}
