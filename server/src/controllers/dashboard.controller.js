import { getDashboardOverview } from '../services/workspace.service.js';

export async function getDashboardData(_req, res) {
    const dashboard = await getDashboardOverview();
    res.json(dashboard);
}
