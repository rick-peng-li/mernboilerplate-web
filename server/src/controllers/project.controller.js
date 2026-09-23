import {
    createProject,
    deleteProjectById,
    getProjectSummary,
    listProjects,
    updateProjectById,
} from '../services/project-data.service.js';

export async function getProjects(_req, res) {
    const projects = await listProjects();
    res.json(projects);
}

export async function getProjectsSummary(_req, res) {
    const summary = await getProjectSummary();
    res.json(summary);
}

export async function postProject(req, res) {
    const createdProject = await createProject(req.validatedBody);
    res.status(201).json(createdProject);
}

export async function putProject(req, res) {
    const updatedProject = await updateProjectById(req.params.projectId, req.validatedBody);

    if (!updatedProject) {
        return res.status(404).json({
            message: 'Project not found.',
        });
    }

    return res.json(updatedProject);
}

export async function removeProject(req, res) {
    const deletedProject = await deleteProjectById(req.params.projectId);

    if (!deletedProject) {
        return res.status(404).json({
            message: 'Project not found.',
        });
    }

    return res.json({
        message: 'Project deleted successfully.',
        project: deletedProject,
    });
}
