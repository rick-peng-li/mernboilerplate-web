const { isDatabaseReady } = require('../config/database');
const Project = require('../models/projectModel');
const defaultProjects = require('../data/defaultProjects');

let memoryProjects = defaultProjects.map((project, index) => ({
    ...project,
    _id: `seed-${index + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
}));

function normalizeProject(project) {
    if (!project) {
        return null;
    }

    const plainProject = typeof project.toObject === 'function' ? project.toObject() : project;

    return {
        ...plainProject,
        id: String(plainProject._id),
    };
}

async function ensureSeedData() {
    if (!isDatabaseReady()) {
        return;
    }

    const count = await Project.countDocuments();
    if (count === 0) {
        await Project.insertMany(defaultProjects);
    }
}

async function listProjects() {
    if (isDatabaseReady()) {
        await ensureSeedData();
        const projects = await Project.find().sort({ updatedAt: -1 });
        return projects.map(normalizeProject);
    }

    return [...memoryProjects]
        .sort((first, second) => new Date(second.updatedAt) - new Date(first.updatedAt))
        .map(normalizeProject);
}

async function createProject(input) {
    if (isDatabaseReady()) {
        const createdProject = await Project.create(input);
        return normalizeProject(createdProject);
    }

    const project = {
        ...input,
        _id: `memory-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    memoryProjects = [project, ...memoryProjects];
    return normalizeProject(project);
}

async function updateProject(id, input) {
    if (isDatabaseReady()) {
        const updatedProject = await Project.findByIdAndUpdate(
            id,
            {
                ...input,
            },
            {
                new: true,
                runValidators: true,
            }
        );
        return normalizeProject(updatedProject);
    }

    const index = memoryProjects.findIndex((project) => String(project._id) === id);
    if (index === -1) {
        return null;
    }

    const updatedProject = {
        ...memoryProjects[index],
        ...input,
        updatedAt: new Date().toISOString(),
    };
    memoryProjects[index] = updatedProject;
    return normalizeProject(updatedProject);
}

async function deleteProject(id) {
    if (isDatabaseReady()) {
        const deletedProject = await Project.findByIdAndDelete(id);
        return normalizeProject(deletedProject);
    }

    const existingProject = memoryProjects.find((project) => String(project._id) === id);
    if (!existingProject) {
        return null;
    }

    memoryProjects = memoryProjects.filter((project) => String(project._id) !== id);
    return normalizeProject(existingProject);
}

async function getSummary() {
    const projects = await listProjects();

    return projects.reduce(
        (summary, project) => {
            summary.total += 1;

            if (project.status === 'Completed') {
                summary.completed += 1;
            }

            if (project.status === 'In Progress') {
                summary.inProgress += 1;
            }

            if (project.status === 'Planned') {
                summary.planned += 1;
            }

            return summary;
        },
        {
            total: 0,
            completed: 0,
            inProgress: 0,
            planned: 0,
        }
    );
}

module.exports = {
    createProject,
    deleteProject,
    getSummary,
    listProjects,
    updateProject,
};
