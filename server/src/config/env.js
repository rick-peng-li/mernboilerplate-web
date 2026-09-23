import path from 'node:path';
import { existsSync } from 'node:fs';
import dotenv from 'dotenv';

const candidateEnvPaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '..', '.env'),
];

candidateEnvPaths.forEach((filePath) => {
    if (existsSync(filePath)) {
        dotenv.config({ path: filePath, override: false });
    }
});

export const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.SERVER_PORT || process.env.PORT || 5051),
    clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    mongoUri: process.env.MONGODB_URI || '',
};
