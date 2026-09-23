import { http } from '@/services/http';

export async function fetchHealth() {
    const { data } = await http.get('/health');
    return data;
}

export async function fetchProjectSummary() {
    const { data } = await http.get('/projects/summary');
    return data;
}

export async function fetchProjects() {
    const { data } = await http.get('/projects');
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
