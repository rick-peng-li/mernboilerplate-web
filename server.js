const express = require('express');
const path = require('path');
const cors = require('cors');

const { connectDatabase, getDataMode } = require('./config/database');

const app = express();

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/api/v1/health', (_req, res) => {
    res.json({
        message: 'Service is running.',
        mode: getDataMode(),
        timestamp: new Date().toISOString(),
    });
});

app.use('/api/v1/projects', require('./routes/api/projects'));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client', 'build')));

    app.get('*', (_req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;

connectDatabase().finally(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT} in ${getDataMode()} mode`);
    });
});
