import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    createProject,
    deleteProject,
    fetchHealth,
    fetchProjects,
    fetchProjectSummary,
    updateProject,
} from '@/services/project-api';

const defaultSummary = {
    total: 0,
    completed: 0,
    inProgress: 0,
    planned: 0,
    mode: 'memory',
};

export function useProjectDashboard() {
    const [projects, setProjects] = useState([]);
    const [summary, setSummary] = useState(defaultSummary);
    const [health, setHealth] = useState({
        message: 'Loading service health...',
        mode: 'checking',
        timestamp: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [deletingId, setDeletingId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const loadDashboard = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const [healthResponse, summaryResponse, projectsResponse] = await Promise.all([
                fetchHealth(),
                fetchProjectSummary(),
                fetchProjects(),
            ]);

            setHealth(healthResponse);
            setSummary(summaryResponse);
            setProjects(projectsResponse);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message || 'Failed to load dashboard.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    const recentProjects = useMemo(() => projects.slice(0, 3), [projects]);

    const saveProject = useCallback(async (values, projectId) => {
        setIsSaving(true);

        try {
            if (projectId) {
                await updateProject(projectId, values);
            } else {
                await createProject(values);
            }

            await loadDashboard();
            return {
                success: true,
                message: projectId ? 'Project updated successfully.' : 'Project created successfully.',
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || 'Failed to save project.',
            };
        } finally {
            setIsSaving(false);
        }
    }, [loadDashboard]);

    const removeProject = useCallback(async (projectId) => {
        setDeletingId(projectId);

        try {
            await deleteProject(projectId);
            await loadDashboard();
            return {
                success: true,
                message: 'Project deleted successfully.',
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || 'Failed to delete project.',
            };
        } finally {
            setDeletingId('');
        }
    }, [loadDashboard]);

    return {
        deletingId,
        errorMessage,
        health,
        isLoading,
        isSaving,
        loadDashboard,
        projects,
        recentProjects,
        removeProject,
        saveProject,
        summary,
    };
}
