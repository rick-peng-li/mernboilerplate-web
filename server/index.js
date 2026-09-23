import { createApp } from './app.js';
import { connectDatabase, getDataMode } from './config/database.js';
import { env } from './config/env.js';

const app = createApp();

connectDatabase().finally(() => {
    app.listen(env.port, () => {
        console.log(`Server running on http://localhost:${env.port} in ${getDataMode()} mode`);
    });
});
