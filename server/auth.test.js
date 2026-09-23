import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';
import { createApp } from './app.js';

test('health endpoint is publicly accessible', async () => {
    const app = createApp();
    const response = await request(app).get('/api/v1/health');

    assert.equal(response.status, 200);
    assert.equal(response.body.message, 'Service is running.');
});

test('login returns an auth token for the seeded admin account', async () => {
    const app = createApp();
    const response = await request(app).post('/api/v1/auth/login').send({
        email: 'admin@mernconsole.dev',
        password: 'Admin@123456',
    });

    assert.equal(response.status, 200);
    assert.ok(response.body.token);
    assert.equal(response.body.user.email, 'admin@mernconsole.dev');
});

test('protected workspace routes reject unauthenticated requests', async () => {
    const app = createApp();
    const response = await request(app).get('/api/v1/dashboard/overview');

    assert.equal(response.status, 401);
    assert.equal(response.body.message, 'Authentication is required.');
});

test('authenticated users can access the protected workspace flow', async () => {
    const app = createApp();
    const loginResponse = await request(app).post('/api/v1/auth/login').send({
        email: 'admin@mernconsole.dev',
        password: 'Admin@123456',
    });

    const meResponse = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${loginResponse.body.token}`);

    const dashboardResponse = await request(app)
        .get('/api/v1/dashboard/overview')
        .set('Authorization', `Bearer ${loginResponse.body.token}`);

    assert.equal(meResponse.status, 200);
    assert.equal(meResponse.body.user.email, 'admin@mernconsole.dev');
    assert.equal(dashboardResponse.status, 200);
    assert.ok(typeof dashboardResponse.body.summary.totalProjects === 'number');
});

test('register creates a new session and token', async () => {
    const app = createApp();
    const response = await request(app).post('/api/v1/auth/register').send({
        name: 'QA Operator',
        email: `qa-${Date.now()}@mernconsole.dev`,
        password: 'Quality@123',
        role: 'Member',
    });

    assert.equal(response.status, 201);
    assert.ok(response.body.token);
    assert.equal(response.body.user.role, 'Member');
});
