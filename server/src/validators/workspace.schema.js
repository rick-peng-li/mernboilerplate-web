import { z } from 'zod';

const urlField = z.union([z.url(), z.literal('')]).optional().default('');
const optionalDateField = z.string().trim().optional().default('');
const stringArray = z.array(z.string().trim().min(1)).default([]).transform((items) => items.filter(Boolean));

export const projectStatusOptions = ['Planned', 'In Progress', 'Completed'];
export const projectPriorityOptions = ['Low', 'Medium', 'High', 'Critical'];
export const projectHealthOptions = ['Healthy', 'Watch', 'At Risk'];
export const taskStatusOptions = ['Todo', 'In Progress', 'Review', 'Done'];
export const memberStatusOptions = ['Active', 'Away'];
export const releaseStatusOptions = ['Planned', 'Ready', 'Released'];

export const projectPayloadSchema = z.object({
    title: z.string().trim().min(1, 'Title is required.'),
    category: z.string().trim().min(1, 'Category is required.'),
    status: z.enum(projectStatusOptions),
    priority: z.enum(projectPriorityOptions),
    health: z.enum(projectHealthOptions),
    progress: z.number().min(0).max(100),
    summary: z.string().trim().min(1, 'Summary is required.'),
    stack: stringArray,
    ownerId: z.string().trim().min(1, 'Owner is required.'),
    memberIds: stringArray,
    repoUrl: urlField,
    demoUrl: urlField,
    dueDate: optionalDateField,
});

export const taskPayloadSchema = z.object({
    title: z.string().trim().min(1, 'Task title is required.'),
    summary: z.string().trim().min(1, 'Task summary is required.'),
    status: z.enum(taskStatusOptions),
    priority: z.enum(projectPriorityOptions),
    projectId: z.string().trim().min(1, 'Project is required.'),
    assigneeId: z.string().trim().min(1, 'Assignee is required.'),
    releaseId: z.string().trim().optional().default(''),
    estimate: z.number().min(0).max(999),
    dueDate: optionalDateField,
});

export const memberPayloadSchema = z.object({
    name: z.string().trim().min(1, 'Name is required.'),
    role: z.string().trim().min(1, 'Role is required.'),
    email: z.email(),
    location: z.string().trim().min(1, 'Location is required.'),
    timezone: z.string().trim().min(1, 'Timezone is required.'),
    allocation: z.number().min(0).max(100),
    capacity: z.number().min(0).max(100),
    skills: stringArray,
    status: z.enum(memberStatusOptions),
});

export const releasePayloadSchema = z.object({
    version: z.string().trim().min(1, 'Version is required.'),
    name: z.string().trim().min(1, 'Release name is required.'),
    status: z.enum(releaseStatusOptions),
    ownerId: z.string().trim().min(1, 'Release owner is required.'),
    projectIds: stringArray,
    taskIds: stringArray,
    releaseDate: optionalDateField,
    summary: z.string().trim().min(1, 'Release summary is required.'),
});

export const settingsPayloadSchema = z.object({
    workspaceName: z.string().trim().min(1, 'Workspace name is required.'),
    defaultView: z.string().trim().min(1, 'Default view is required.'),
    timezone: z.string().trim().min(1, 'Timezone is required.'),
    dailyDigestTime: z.string().trim().min(1, 'Daily digest time is required.'),
    releaseWindow: z.string().trim().min(1, 'Release window is required.'),
    notifications: z.object({
        email: z.boolean(),
        slack: z.boolean(),
        browser: z.boolean(),
    }),
});
