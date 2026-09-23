import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envRoot = path.resolve(__dirname, '..');

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, envRoot, '');
    const apiBaseUrl = env.VITE_API_BASE_URL || 'http://localhost:5051/api/v1';

    return {
        envDir: envRoot,
        plugins: [react()],
        build: {
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes('node_modules/@mui') || id.includes('node_modules/@emotion')) {
                            return 'mui';
                        }

                        if (id.includes('node_modules/react-router')) {
                            return 'router';
                        }

                        if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
                            return 'react';
                        }

                        if (id.includes('node_modules/axios')) {
                            return 'http';
                        }
                    },
                },
            },
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
        server: {
            port: Number(env.CLIENT_PORT || 5173),
            proxy: {
                '/api': {
                    target: apiBaseUrl.replace(/\/api\/v1$/, ''),
                    changeOrigin: true,
                },
            },
        },
    };
});
