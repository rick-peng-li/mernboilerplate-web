const AUTH_TOKEN_KEY = 'mern-project-console.auth-token';

export function getAuthToken() {
    return window.localStorage.getItem(AUTH_TOKEN_KEY) || '';
}

export function setAuthToken(token) {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
}
