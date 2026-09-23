import { getSettings, updateSettings } from '../services/workspace.service.js';

export async function getWorkspaceSettings(_req, res) {
    const settings = await getSettings();
    res.json(settings);
}

export async function putWorkspaceSettings(req, res) {
    const settings = await updateSettings(req.validatedBody);
    res.json(settings);
}
