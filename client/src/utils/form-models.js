export const initialProjectValues = {
    title: '',
    category: '',
    status: 'Planned',
    priority: 'Medium',
    health: 'Healthy',
    progress: 0,
    summary: '',
    stack: '',
    ownerId: '',
    memberIds: [],
    repoUrl: '',
    demoUrl: '',
    dueDate: '',
};

export const initialTaskValues = {
    title: '',
    summary: '',
    status: 'Todo',
    priority: 'Medium',
    projectId: '',
    assigneeId: '',
    releaseId: '',
    estimate: 1,
    dueDate: '',
};

export const initialMemberValues = {
    name: '',
    role: '',
    email: '',
    location: '',
    timezone: 'UTC+8',
    allocation: 50,
    capacity: 100,
    skills: '',
    status: 'Active',
};

export const initialReleaseValues = {
    version: '',
    name: '',
    status: 'Planned',
    ownerId: '',
    projectIds: [],
    taskIds: [],
    releaseDate: '',
    summary: '',
};

export function mapProjectToFormValues(project) {
    return project
        ? {
              ...project,
              stack: Array.isArray(project.stack) ? project.stack.join(', ') : '',
          }
        : initialProjectValues;
}

export function normalizeProjectPayload(values) {
    return {
        ...values,
        progress: Number(values.progress),
        stack: String(values.stack || '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
    };
}

export function mapTaskToFormValues(task) {
    return task ? { ...task, estimate: Number(task.estimate || 0) } : initialTaskValues;
}

export function normalizeTaskPayload(values) {
    return {
        ...values,
        estimate: Number(values.estimate),
    };
}

export function mapMemberToFormValues(member) {
    return member
        ? {
              ...member,
              skills: Array.isArray(member.skills) ? member.skills.join(', ') : '',
          }
        : initialMemberValues;
}

export function normalizeMemberPayload(values) {
    return {
        ...values,
        allocation: Number(values.allocation),
        capacity: Number(values.capacity),
        skills: String(values.skills || '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
    };
}

export function mapReleaseToFormValues(release) {
    return release ? { ...release } : initialReleaseValues;
}

export function normalizeReleasePayload(values) {
    return values;
}

export function normalizeSettingsPayload(values) {
    return {
        ...values,
        notifications: {
            email: Boolean(values.notifications.email),
            slack: Boolean(values.notifications.slack),
            browser: Boolean(values.notifications.browser),
        },
    };
}
