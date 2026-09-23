import { listActivities } from '../services/workspace.service.js';

export async function getActivities(req, res) {
    const activities = await listActivities();
    const { projectId, type } = req.query;

    const filteredActivities = activities.filter((activity) => {
        if (projectId && activity.projectId !== projectId) {
            return false;
        }

        if (type && activity.type !== type) {
            return false;
        }

        return true;
    });

    res.json(filteredActivities);
}
