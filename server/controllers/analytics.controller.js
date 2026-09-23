import { getAnalyticsOverview } from '../services/workspace.service.js';

export async function getAnalytics(_req, res) {
    const analytics = await getAnalyticsOverview();
    res.json(analytics);
}
