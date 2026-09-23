const mongoose = require('mongoose');

let dataMode = 'memory';

async function connectDatabase() {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        console.warn('MONGODB_URI is not set. Falling back to in-memory data.');
        return { connected: false, mode: dataMode };
    }

    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
        });
        dataMode = 'mongodb';
        console.log('MongoDB connection established successfully.');
        return { connected: true, mode: dataMode };
    } catch (error) {
        dataMode = 'memory';
        console.error(`MongoDB connection failed: ${error.message}`);
        console.warn('Falling back to in-memory data.');
        return { connected: false, mode: dataMode };
    }
}

function isDatabaseReady() {
    return mongoose.connection.readyState === 1;
}

function getDataMode() {
    return dataMode;
}

module.exports = {
    connectDatabase,
    isDatabaseReady,
    getDataMode,
};
