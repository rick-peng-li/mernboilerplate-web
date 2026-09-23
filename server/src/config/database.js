import mongoose from 'mongoose';
import { env } from './env.js';

let dataMode = 'memory';

export async function connectDatabase() {
    if (!env.mongoUri) {
        console.warn('MONGODB_URI is not configured. Using in-memory data mode.');
        return { connected: false, mode: dataMode };
    }

    try {
        await mongoose.connect(env.mongoUri, {
            serverSelectionTimeoutMS: 5000,
        });
        dataMode = 'mongodb';
        console.log('MongoDB connected successfully.');
        return { connected: true, mode: dataMode };
    } catch (error) {
        dataMode = 'memory';
        console.error(`MongoDB connection failed: ${error.message}`);
        console.warn('Falling back to in-memory data mode.');
        return { connected: false, mode: dataMode };
    }
}

export function getDataMode() {
    return dataMode;
}

export function isDatabaseReady() {
    return mongoose.connection.readyState === 1;
}
