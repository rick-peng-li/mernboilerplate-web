import { defaultProjects } from '../data/default-projects.js';
import { getDataMode, isDatabaseReady } from '../config/database.js';
import { Project } from '../models/project.model.js';

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

async function seedDatabaseIfNeeded() {
    if (!isDatabaseReady()) {
        return;
    }

    const count = await Project.countDocuments();
    if (count === 0) {
        await Project.insertMany(defaultProjects);
    }
}

export async function listProjects() {
    if (isDatabaseReady()) {
        await seedDatabaseIfNeeded();
        const records = await Project.find().sort({ updatedAt: -1 }).lean();
        return records.map(normalizeProject);
    }

    return [...memoryProjects]
        .sort((first, second) => new Date(second.updatedAt) - new Date(first.updatedAt))
        .map(normalizeProject);
}

export async function getProjectSummary() {
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
            mode: getDataMode(),
        }
    );
}

export async function createProject(payload) {
    if (isDatabaseReady()) {
        const createdProject = await Project.create(payload);
        return normalizeProject(createdProject);
    }

    const createdProject = {
        ...payload,
        _id: `memory-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    memoryProjects = [createdProject, ...memoryProjects];
    return normalizeProject(createdProject);
}

export async function updateProjectById(projectId, payload) {
    if (isDatabaseReady()) {
        const updatedProject = await Project.findByIdAndUpdate(projectId, payload, {
            new: true,
            runValidators: true,
        }).lean();

        return normalizeProject(updatedProject);
    }

    const index = memoryProjects.findIndex((project) => String(project._id) === projectId);
    if (index === -1) {
        return null;
    }

    memoryProjects[index] = {
        ...memoryProjects[index],
        ...payload,
        updatedAt: new Date().toISOString(),
    };

    return normalizeProject(memoryProjects[index]);
}

export async function deleteProjectById(projectId) {
    if (isDatabaseReady()) {
        const deletedProject = await Project.findByIdAndDelete(projectId).lean();
        return normalizeProject(deletedProject);
    }

    const existingProject = memoryProjects.find((project) => String(project._id) === projectId);
    if (!existingProject) {
        return null;
    }

    memoryProjects = memoryProjects.filter((project) => String(project._id) !== projectId);
    return normalizeProject(existingProject);
}
