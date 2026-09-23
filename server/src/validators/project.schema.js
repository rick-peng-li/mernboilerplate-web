import { z } from 'zod';

export const projectStatuses = ['Planned', 'In Progress', 'Completed'];

const urlField = z.union([z.string().trim().url(), z.literal('')]).optional().default('');

export const projectPayloadSchema = z.object({
    title: z.string().trim().min(1, 'Title is required.'),
    category: z.string().trim().min(1, 'Category is required.'),
    status: z.enum(projectStatuses),
    summary: z.string().trim().min(1, 'Summary is required.'),
    stack: z
        .array(z.string().trim().min(1))
        .default([])
        .transform((items) => items.filter(Boolean)),
    repoUrl: urlField,
    demoUrl: urlField,
});
