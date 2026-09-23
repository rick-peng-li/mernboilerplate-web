const express = require('express');

const {
    createProject,
    deleteProject,
    getSummary,
    listProjects,
    updateProject,
} = require('../../services/projectStore');

const router = express.Router();

function sanitizeProjectPayload(payload) {
    const stack = Array.isArray(payload.stack)
        ? payload.stack
        : String(payload.stack || '')
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean);

    return {
        title: String(payload.title || '').trim(),
        category: String(payload.category || '').trim(),
        status: String(payload.status || 'Planned').trim(),
        summary: String(payload.summary || '').trim(),
        stack,
        repoUrl: String(payload.repoUrl || '').trim(),
        demoUrl: String(payload.demoUrl || '').trim(),
    };
}

function validateProjectPayload(project) {
    if (!project.title || !project.category || !project.summary) {
        return 'Title, category, and summary are required.';
    }

    if (!['Planned', 'In Progress', 'Completed'].includes(project.status)) {
        return 'Status must be Planned, In Progress, or Completed.';
    }

    return null;
}

router.get('/', async (_req, res) => {
    try {
        const projects = await listProjects();
        return res.json(projects);
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Failed to load projects.' });
    }
});

router.get('/summary', async (_req, res) => {
    try {
        const summary = await getSummary();
        return res.json(summary);
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Failed to load project summary.' });
    }
});

router.post('/', async (req, res) => {
    try {
        const project = sanitizeProjectPayload(req.body);
        const validationError = validateProjectPayload(project);

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const createdProject = await createProject(project);
        return res.status(201).json(createdProject);
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Failed to create project.' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const project = sanitizeProjectPayload(req.body);
        const validationError = validateProjectPayload(project);

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const updatedProject = await updateProject(req.params.id, project);
        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        return res.json(updatedProject);
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Failed to update project.' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedProject = await deleteProject(req.params.id);
        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        return res.json({
            message: 'Project deleted successfully.',
            project: deletedProject,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Failed to delete project.' });
    }
});

module.exports = router;
