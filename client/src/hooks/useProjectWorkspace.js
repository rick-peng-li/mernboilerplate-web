import { useCallback, useEffect, useState } from 'react';
import { fetchProjectDetail } from '@/services/workspace-api';

function getErrorMessage(error, fallback) {
    return error.response?.data?.message || error.message || fallback;
}

export function useProjectWorkspace(projectId) {
    const [workspace, setWorkspace] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const loadProjectWorkspace = useCallback(async () => {
        if (!projectId) {
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await fetchProjectDetail(projectId);
            setWorkspace(response);
        } catch (error) {
            setErrorMessage(getErrorMessage(error, 'Failed to load project workspace.'));
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        loadProjectWorkspace();
    }, [loadProjectWorkspace]);

    return {
        errorMessage,
        isLoading,
        loadProjectWorkspace,
        workspace,
    };
}
