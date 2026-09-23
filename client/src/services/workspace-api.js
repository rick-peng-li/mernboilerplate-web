import { http } from '@/services/http';

export async function fetchHealth() {
    const { data } = await http.get('/health');
    return data;
}

export async function fetchDashboardOverview() {
    const { data } = await http.get('/dashboard/overview');
    return data;
}

export async function fetchProjects() {
    const { data } = await http.get('/projects');
    return data;
}

export async function fetchProjectDetail(projectId) {
    const { data } = await http.get(`/projects/${projectId}`);
    return data;
}

export async function createProject(payload) {
    const { data } = await http.post('/projects', payload);
    return data;
}

export async function updateProject(projectId, payload) {
    const { data } = await http.put(`/projects/${projectId}`, payload);
    return data;
}

export async function deleteProject(projectId) {
    const { data } = await http.delete(`/projects/${projectId}`);
    return data;
}

export async function fetchTasks(params) {
    const { data } = await http.get('/tasks', { params });
    return data;
}

export async function createTask(payload) {
    const { data } = await http.post('/tasks', payload);
    return data;
}

export async function updateTask(taskId, payload) {
    const { data } = await http.put(`/tasks/${taskId}`, payload);
    return data;
}

export async function deleteTask(taskId) {
    const { data } = await http.delete(`/tasks/${taskId}`);
    return data;
}

export async function fetchMembers() {
    const { data } = await http.get('/team');
    return data;
}

export async function createMember(payload) {
    const { data } = await http.post('/team', payload);
    return data;
}

export async function updateMember(memberId, payload) {
    const { data } = await http.put(`/team/${memberId}`, payload);
    return data;
}

export async function deleteMember(memberId) {
    const { data } = await http.delete(`/team/${memberId}`);
    return data;
}

export async function fetchReleases(params) {
    const { data } = await http.get('/releases', { params });
    return data;
}

export async function createRelease(payload) {
    const { data } = await http.post('/releases', payload);
    return data;
}

export async function updateRelease(releaseId, payload) {
    const { data } = await http.put(`/releases/${releaseId}`, payload);
    return data;
}

export async function deleteRelease(releaseId) {
    const { data } = await http.delete(`/releases/${releaseId}`);
    return data;
}

export async function fetchActivities(params) {
    const { data } = await http.get('/activities', { params });
    return data;
}

export async function fetchAnalytics() {
    const { data } = await http.get('/analytics');
    return data;
}

export async function fetchSettings() {
    const { data } = await http.get('/settings');
    return data;
}

export async function updateSettings(payload) {
    const { data } = await http.put('/settings', payload);
    return data;
}
