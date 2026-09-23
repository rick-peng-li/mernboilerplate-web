export const projectStatusOptions = ['Planned', 'In Progress', 'Completed'];
export const projectPriorityOptions = ['Low', 'Medium', 'High', 'Critical'];
export const projectHealthOptions = ['Healthy', 'Watch', 'At Risk'];
export const taskStatusOptions = ['Todo', 'In Progress', 'Review', 'Done'];
export const memberStatusOptions = ['Active', 'Away'];
export const releaseStatusOptions = ['Planned', 'Ready', 'Released'];

export const statusColorMap = {
    Planned: 'warning',
    'In Progress': 'info',
    Completed: 'success',
    Todo: 'default',
    Review: 'secondary',
    Done: 'success',
    Ready: 'info',
    Released: 'success',
    Active: 'success',
    Away: 'warning',
    Healthy: 'success',
    Watch: 'warning',
    'At Risk': 'error',
    Low: 'default',
    Medium: 'info',
    High: 'warning',
    Critical: 'error',
    Info: 'info',
    Success: 'success',
    Warning: 'warning',
};
