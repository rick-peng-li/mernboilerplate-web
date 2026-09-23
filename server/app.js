import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { createCorsOptions } from './config/cors.js';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFoundHandler } from './middleware/not-found.js';

export function createApp() {
    const app = express();

    app.use(cors(createCorsOptions()));
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get('/', (_req, res) => {
        res.json({
            name: 'MERN Project Console API',
            version: '2.0.0',
            docs: '/api/v1/health',
        });
    });

    app.use('/api/v1', apiRoutes);
    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}
