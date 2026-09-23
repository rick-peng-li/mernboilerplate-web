export const initialProjectFormValues = {
    title: '',
    category: '',
    status: 'Planned',
    summary: '',
    stack: '',
    repoUrl: '',
    demoUrl: '',
};

export function mapProjectToFormValues(project) {
    if (!project) {
        return initialProjectFormValues;
    }

    return {
        title: project.title || '',
        category: project.category || '',
        status: project.status || 'Planned',
        summary: project.summary || '',
        stack: Array.isArray(project.stack) ? project.stack.join(', ') : '',
        repoUrl: project.repoUrl || '',
        demoUrl: project.demoUrl || '',
    };
}

export function normalizeProjectPayload(values) {
    return {
        ...values,
        stack: values.stack
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
        repoUrl: values.repoUrl.trim(),
        demoUrl: values.demoUrl.trim(),
    };
}
