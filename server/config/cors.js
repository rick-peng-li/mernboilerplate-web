import { env } from './env.js';

export function createCorsOptions() {
    return {
        origin: env.clientOrigin,
        credentials: true,
    };
}
