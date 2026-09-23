import { useContext } from 'react';
import { AuthContext } from '@/app/AuthContext';

export function useAuth() {
    return useContext(AuthContext);
}
