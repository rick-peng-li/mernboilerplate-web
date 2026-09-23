import { z } from 'zod';

export const loginPayloadSchema = z.object({
    email: z.email(),
    password: z.string().min(8, 'Password must contain at least 8 characters.'),
});

export const registerPayloadSchema = z.object({
    name: z.string().trim().min(1, 'Name is required.'),
    email: z.email(),
    password: z
        .string()
        .min(8, 'Password must contain at least 8 characters.')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
        .regex(/[0-9]/, 'Password must contain at least one number.'),
    role: z.enum(['Admin', 'Manager', 'Member']).optional().default('Member'),
    status: z.enum(['Active', 'Invited']).optional().default('Active'),
});
