import { useOutletContext } from 'react-router-dom';

export function useWorkspaceContext() {
    return useOutletContext();
}
