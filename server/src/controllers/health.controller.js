import { getDataMode } from '../config/database.js';

export function getHealth(_req, res) {
    res.json({
        message: 'Service is running.',
        mode: getDataMode(),
        timestamp: new Date().toISOString(),
    });
}
