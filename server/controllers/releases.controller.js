import {
    createReleaseEntry,
    deleteReleaseEntry,
    listReleases,
    updateReleaseEntry,
} from '../services/workspace.service.js';

export async function getReleases(req, res) {
    const releases = await listReleases();
    const { projectId, status } = req.query;

    const filteredReleases = releases.filter((release) => {
        if (projectId && !release.projectIds.includes(projectId)) {
            return false;
        }

        if (status && release.status !== status) {
            return false;
        }

        return true;
    });

    res.json(filteredReleases);
}

export async function postRelease(req, res) {
    const createdRelease = await createReleaseEntry(req.validatedBody);
    res.status(201).json(createdRelease);
}

export async function putRelease(req, res) {
    const updatedRelease = await updateReleaseEntry(req.params.releaseId, req.validatedBody);

    if (!updatedRelease) {
        return res.status(404).json({
            message: 'Release not found.',
        });
    }

    return res.json(updatedRelease);
}

export async function removeRelease(req, res) {
    const deletedRelease = await deleteReleaseEntry(req.params.releaseId);

    if (!deletedRelease) {
        return res.status(404).json({
            message: 'Release not found.',
        });
    }

    return res.json({
        message: 'Release deleted successfully.',
        release: deletedRelease,
    });
}
