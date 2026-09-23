import {
    createProjectEntry,
    deleteProjectEntry,
    getProjectById,
    listProjects,
    updateProjectEntry,
} from '../services/workspace.service.js';

export async function getProjects(_req, res) {
    const projects = await listProjects();
    res.json(projects);
}

export async function getProjectDetail(req, res) {
    const project = await getProjectById(req.params.projectId);

    if (!project) {
        return res.status(404).json({
            message: 'Project not found.',
        });
    }

    return res.json(project);
}

export async function postProject(req, res) {
    const createdProject = await createProjectEntry(req.validatedBody);
    res.status(201).json(createdProject);
}

export async function putProject(req, res) {
    const updatedProject = await updateProjectEntry(req.params.projectId, req.validatedBody);

    if (!updatedProject) {
        return res.status(404).json({
            message: 'Project not found.',
        });
    }

    return res.json(updatedProject);
}

export async function removeProject(req, res) {
    const deletedProject = await deleteProjectEntry(req.params.projectId);

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
