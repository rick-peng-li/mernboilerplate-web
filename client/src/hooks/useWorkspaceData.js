import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    createMember,
    createProject,
    createRelease,
    createTask,
    deleteMember,
    deleteProject,
    deleteRelease,
    deleteTask,
    fetchActivities,
    fetchAnalytics,
    fetchDashboardOverview,
    fetchHealth,
    fetchMembers,
    fetchProjects,
    fetchReleases,
    fetchSettings,
    fetchTasks,
    updateMember,
    updateProject,
    updateRelease,
    updateSettings,
    updateTask,
} from '@/services/workspace-api';

const defaultDashboard = {
    summary: {
        totalProjects: 0,
        activeProjects: 0,
        totalTasks: 0,
        activeMembers: 0,
        upcomingReleases: 0,
        dataMode: 'memory',
    },
    spotlightProjects: [],
    recentActivities: [],
    upcomingReleases: [],
    criticalTasks: [],
    teamCapacity: [],
    settings: null,
    breakdowns: {
        projectStatus: {},
        taskStatus: {},
        releaseStatus: {},
    },
};

function getErrorMessage(error, fallback) {
    return error.response?.data?.message || error.message || fallback;
}

export function useWorkspaceData() {
    const [health, setHealth] = useState({
        message: 'Loading service health...',
        mode: 'checking',
        timestamp: '',
    });
    const [dashboard, setDashboard] = useState(defaultDashboard);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [members, setMembers] = useState([]);
    const [releases, setReleases] = useState([]);
    const [activities, setActivities] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [settings, setSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeMutationKey, setActiveMutationKey] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const loadWorkspace = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const [
                healthResponse,
                dashboardResponse,
                projectsResponse,
                tasksResponse,
                membersResponse,
                releasesResponse,
                activitiesResponse,
                analyticsResponse,
                settingsResponse,
            ] = await Promise.all([
                fetchHealth(),
                fetchDashboardOverview(),
                fetchProjects(),
                fetchTasks(),
                fetchMembers(),
                fetchReleases(),
                fetchActivities(),
                fetchAnalytics(),
                fetchSettings(),
            ]);

            setHealth(healthResponse);
            setDashboard(dashboardResponse);
            setProjects(projectsResponse);
            setTasks(tasksResponse);
            setMembers(membersResponse);
            setReleases(releasesResponse);
            setActivities(activitiesResponse);
            setAnalytics(analyticsResponse);
            setSettings(settingsResponse);
        } catch (error) {
            setErrorMessage(getErrorMessage(error, 'Failed to load workspace data.'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadWorkspace();
    }, [loadWorkspace]);

    const projectOptions = useMemo(
        () => projects.map((project) => ({ label: project.title, value: project.id })),
        [projects]
    );

    const memberOptions = useMemo(
        () => members.map((member) => ({ label: member.name, value: member.id })),
        [members]
    );

    const releaseOptions = useMemo(
        () => releases.map((release) => ({ label: `${release.version} · ${release.name}`, value: release.id })),
        [releases]
    );

    const handleMutation = useCallback(async (mutationKey, action, successMessage) => {
        setIsSaving(true);
        setActiveMutationKey(mutationKey);

        try {
            await action();
            await loadWorkspace();
            return {
                success: true,
                message: successMessage,
            };
        } catch (error) {
            return {
                success: false,
                message: getErrorMessage(error, 'Operation failed.'),
            };
        } finally {
            setIsSaving(false);
            setActiveMutationKey('');
        }
    }, [loadWorkspace]);

    const saveProject = useCallback(
        (payload, projectId) =>
            handleMutation(
                projectId || 'project-create',
                () => (projectId ? updateProject(projectId, payload) : createProject(payload)),
                projectId ? 'Project updated successfully.' : 'Project created successfully.'
            ),
        [handleMutation]
    );

    const removeProject = useCallback(
        (projectId) =>
            handleMutation(projectId, () => deleteProject(projectId), 'Project deleted successfully.'),
        [handleMutation]
    );

    const saveTask = useCallback(
        (payload, taskId) =>
            handleMutation(
                taskId || 'task-create',
                () => (taskId ? updateTask(taskId, payload) : createTask(payload)),
                taskId ? 'Task updated successfully.' : 'Task created successfully.'
            ),
        [handleMutation]
    );

    const removeTask = useCallback(
        (taskId) => handleMutation(taskId, () => deleteTask(taskId), 'Task deleted successfully.'),
        [handleMutation]
    );

    const saveMember = useCallback(
        (payload, memberId) =>
            handleMutation(
                memberId || 'member-create',
                () => (memberId ? updateMember(memberId, payload) : createMember(payload)),
                memberId ? 'Team member updated successfully.' : 'Team member created successfully.'
            ),
        [handleMutation]
    );

    const removeMember = useCallback(
        (memberId) => handleMutation(memberId, () => deleteMember(memberId), 'Team member deleted successfully.'),
        [handleMutation]
    );

    const saveRelease = useCallback(
        (payload, releaseId) =>
            handleMutation(
                releaseId || 'release-create',
                () => (releaseId ? updateRelease(releaseId, payload) : createRelease(payload)),
                releaseId ? 'Release updated successfully.' : 'Release created successfully.'
            ),
        [handleMutation]
    );

    const removeRelease = useCallback(
        (releaseId) => handleMutation(releaseId, () => deleteRelease(releaseId), 'Release deleted successfully.'),
        [handleMutation]
    );

    const saveSettings = useCallback(
        (payload) => handleMutation('settings', () => updateSettings(payload), 'Workspace settings updated successfully.'),
        [handleMutation]
    );

    return {
        activities,
        activeMutationKey,
        analytics,
        dashboard,
        errorMessage,
        health,
        isLoading,
        isSaving,
        loadWorkspace,
        memberOptions,
        members,
        projectOptions,
        projects,
        releaseOptions,
        releases,
        removeMember,
        removeProject,
        removeRelease,
        removeTask,
        saveMember,
        saveProject,
        saveRelease,
        saveSettings,
        saveTask,
        settings,
        tasks,
    };
}
