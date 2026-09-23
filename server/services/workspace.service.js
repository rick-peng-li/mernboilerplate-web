import { getDataMode, isDatabaseReady } from '../config/database.js';
import { workspaceSeed } from '../data/workspace-seed.js';
import { Activity } from '../models/activity.model.js';
import { Member } from '../models/member.model.js';
import { Project } from '../models/project.model.js';
import { Release } from '../models/release.model.js';
import { Setting } from '../models/setting.model.js';
import { Task } from '../models/task.model.js';

const collectionModels = {
    projects: Project,
    members: Member,
    tasks: Task,
    releases: Release,
    activities: Activity,
};

function cloneSeedStore() {
    return structuredClone(workspaceSeed);
}

let memoryStore = cloneSeedStore();

function normalizeEntity(entity) {
    if (!entity) {
        return null;
    }

    const plain = typeof entity.toObject === 'function' ? entity.toObject() : entity;

    return {
        ...plain,
        id: String(plain._id),
    };
}

function createEntityId(collectionName) {
    return `${collectionName.slice(0, -1)}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

async function ensureSeedData() {
    if (!isDatabaseReady()) {
        return;
    }

    await Promise.all(
        Object.entries(collectionModels).map(async ([collectionName, model]) => {
            const count = await model.countDocuments();
            if (count === 0) {
                await model.insertMany(workspaceSeed[collectionName]);
            }
        })
    );

    const settingsCount = await Setting.countDocuments();
    if (settingsCount === 0) {
        await Setting.create(workspaceSeed.settings);
    }
}

async function listCollection(collectionName) {
    if (isDatabaseReady()) {
        await ensureSeedData();
        const records = await collectionModels[collectionName].find().lean();
        return records.map(normalizeEntity);
    }

    return memoryStore[collectionName].map(normalizeEntity);
}

async function getCollectionItem(collectionName, id) {
    if (isDatabaseReady()) {
        await ensureSeedData();
        const record = await collectionModels[collectionName].findById(id).lean();
        return normalizeEntity(record);
    }

    const record = memoryStore[collectionName].find((item) => String(item._id) === id);
    return normalizeEntity(record);
}

async function createCollectionItem(collectionName, payload) {
    const now = new Date().toISOString();

    if (isDatabaseReady()) {
        await ensureSeedData();
        const createdRecord = await collectionModels[collectionName].create({
            ...payload,
            createdAt: now,
            updatedAt: now,
        });
        return normalizeEntity(createdRecord);
    }

    const createdRecord = {
        ...payload,
        _id: createEntityId(collectionName),
        createdAt: now,
        updatedAt: now,
    };

    memoryStore[collectionName] = [createdRecord, ...memoryStore[collectionName]];
    return normalizeEntity(createdRecord);
}

async function updateCollectionItem(collectionName, id, payload) {
    const now = new Date().toISOString();

    if (isDatabaseReady()) {
        await ensureSeedData();
        const updatedRecord = await collectionModels[collectionName]
            .findByIdAndUpdate(
                id,
                {
                    ...payload,
                    updatedAt: now,
                },
                {
                    new: true,
                    runValidators: true,
                }
            )
            .lean();

        return normalizeEntity(updatedRecord);
    }

    const index = memoryStore[collectionName].findIndex((item) => String(item._id) === id);
    if (index === -1) {
        return null;
    }

    memoryStore[collectionName][index] = {
        ...memoryStore[collectionName][index],
        ...payload,
        updatedAt: now,
    };

    return normalizeEntity(memoryStore[collectionName][index]);
}

async function deleteCollectionItem(collectionName, id) {
    if (isDatabaseReady()) {
        await ensureSeedData();
        const deletedRecord = await collectionModels[collectionName].findByIdAndDelete(id).lean();
        return normalizeEntity(deletedRecord);
    }

    const existingRecord = memoryStore[collectionName].find((item) => String(item._id) === id);
    if (!existingRecord) {
        return null;
    }

    memoryStore[collectionName] = memoryStore[collectionName].filter((item) => String(item._id) !== id);
    return normalizeEntity(existingRecord);
}

async function addActivity(payload) {
    const activityPayload = {
        actorId: payload.actorId || '',
        projectId: payload.projectId || '',
        type: payload.type,
        title: payload.title,
        description: payload.description,
        severity: payload.severity || 'Info',
        happenedAt: new Date().toISOString(),
    };

    if (isDatabaseReady()) {
        await ensureSeedData();
        await Activity.create(activityPayload);
        return;
    }

    memoryStore.activities = [
        {
            ...activityPayload,
            _id: createEntityId('activities'),
        },
        ...memoryStore.activities,
    ];
}

function sortByNewest(items, fieldName) {
    return [...items].sort((first, second) => new Date(second[fieldName]) - new Date(first[fieldName]));
}

function getStatusBreakdown(items, fieldName) {
    return items.reduce((result, item) => {
        const key = item[fieldName];
        result[key] = (result[key] || 0) + 1;
        return result;
    }, {});
}

export async function getWorkspaceCollections() {
    const [projects, members, tasks, releases, activities, settings] = await Promise.all([
        listProjects(),
        listMembers(),
        listTasks(),
        listReleases(),
        listActivities(),
        getSettings(),
    ]);

    return {
        projects,
        members,
        tasks,
        releases,
        activities,
        settings,
    };
}

export async function getDashboardOverview() {
    const { activities, members, projects, releases, settings, tasks } = await getWorkspaceCollections();

    const upcomingReleases = releases
        .filter((release) => release.status !== 'Released')
        .sort((first, second) => new Date(first.releaseDate) - new Date(second.releaseDate))
        .slice(0, 3);

    const criticalTasks = tasks
        .filter((task) => task.priority === 'Critical' || task.priority === 'High')
        .sort((first, second) => new Date(first.dueDate) - new Date(second.dueDate))
        .slice(0, 5);

    const teamCapacity = members.map((member) => ({
        id: member.id,
        name: member.name,
        allocation: member.allocation,
        capacity: member.capacity,
    }));

    return {
        summary: {
            totalProjects: projects.length,
            activeProjects: projects.filter((project) => project.status === 'In Progress').length,
            totalTasks: tasks.length,
            activeMembers: members.length,
            upcomingReleases: releases.filter((release) => release.status !== 'Released').length,
            dataMode: getDataMode(),
        },
        spotlightProjects: sortByNewest(projects, 'updatedAt').slice(0, 4),
        recentActivities: sortByNewest(activities, 'happenedAt').slice(0, 6),
        upcomingReleases,
        criticalTasks,
        teamCapacity,
        settings,
        breakdowns: {
            projectStatus: getStatusBreakdown(projects, 'status'),
            taskStatus: getStatusBreakdown(tasks, 'status'),
            releaseStatus: getStatusBreakdown(releases, 'status'),
        },
    };
}

export async function getAnalyticsOverview() {
    const { members, projects, releases, tasks } = await getWorkspaceCollections();

    const onTrackProjects = projects.filter((project) => project.health === 'Healthy').length;
    const atRiskProjects = projects.filter((project) => project.health === 'At Risk').length;

    return {
        portfolio: {
            averageProgress: Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / Math.max(projects.length, 1)),
            onTrackProjects,
            atRiskProjects,
        },
        projectStatusBreakdown: getStatusBreakdown(projects, 'status'),
        taskPriorityBreakdown: getStatusBreakdown(tasks, 'priority'),
        memberUtilization: members.map((member) => ({
            id: member.id,
            name: member.name,
            role: member.role,
            allocation: member.allocation,
            capacity: member.capacity,
        })),
        releaseCalendar: releases
            .map((release) => ({
                id: release.id,
                version: release.version,
                name: release.name,
                status: release.status,
                releaseDate: release.releaseDate,
            }))
            .sort((first, second) => new Date(first.releaseDate) - new Date(second.releaseDate)),
        projectHealthMatrix: projects.map((project) => ({
            id: project.id,
            title: project.title,
            progress: project.progress,
            health: project.health,
            priority: project.priority,
        })),
    };
}

export async function listProjects() {
    return sortByNewest(await listCollection('projects'), 'updatedAt');
}

export async function getProjectById(projectId) {
    const project = await getCollectionItem('projects', projectId);

    if (!project) {
        return null;
    }

    const { activities, members, releases, tasks } = await getWorkspaceCollections();

    return {
        ...project,
        owner: members.find((member) => member.id === project.ownerId) || null,
        members: members.filter((member) => project.memberIds.includes(member.id)),
        tasks: tasks.filter((task) => task.projectId === project.id),
        releases: releases.filter((release) => release.projectIds.includes(project.id)),
        activities: activities.filter((activity) => activity.projectId === project.id).slice(0, 8),
    };
}

export async function createProjectEntry(payload) {
    const createdProject = await createCollectionItem('projects', payload);

    await addActivity({
        type: 'project',
        actorId: createdProject.ownerId,
        projectId: createdProject.id,
        title: 'Created a new project',
        description: `${createdProject.title} was added to the workspace.`,
        severity: 'Success',
    });

    return createdProject;
}

export async function updateProjectEntry(projectId, payload) {
    const updatedProject = await updateCollectionItem('projects', projectId, payload);
    if (!updatedProject) {
        return null;
    }

    await addActivity({
        type: 'project',
        actorId: updatedProject.ownerId,
        projectId: updatedProject.id,
        title: 'Updated project details',
        description: `${updatedProject.title} was refreshed with the latest delivery information.`,
        severity: 'Info',
    });

    return updatedProject;
}

export async function deleteProjectEntry(projectId) {
    const deletedProject = await deleteCollectionItem('projects', projectId);
    if (!deletedProject) {
        return null;
    }

    await addActivity({
        type: 'project',
        actorId: deletedProject.ownerId,
        projectId,
        title: 'Removed a project',
        description: `${deletedProject.title} was removed from the workspace.`,
        severity: 'Warning',
    });

    return deletedProject;
}

export async function listTasks() {
    return sortByNewest(await listCollection('tasks'), 'updatedAt');
}

export async function createTaskEntry(payload) {
    const createdTask = await createCollectionItem('tasks', payload);

    await addActivity({
        type: 'task',
        actorId: createdTask.assigneeId,
        projectId: createdTask.projectId,
        title: 'Created a task',
        description: `${createdTask.title} was added to the delivery board.`,
        severity: 'Info',
    });

    return createdTask;
}

export async function updateTaskEntry(taskId, payload) {
    const updatedTask = await updateCollectionItem('tasks', taskId, payload);
    if (!updatedTask) {
        return null;
    }

    await addActivity({
        type: 'task',
        actorId: updatedTask.assigneeId,
        projectId: updatedTask.projectId,
        title: 'Updated task progress',
        description: `${updatedTask.title} moved to ${updatedTask.status}.`,
        severity: updatedTask.status === 'Done' ? 'Success' : 'Info',
    });

    return updatedTask;
}

export async function deleteTaskEntry(taskId) {
    const deletedTask = await deleteCollectionItem('tasks', taskId);
    if (!deletedTask) {
        return null;
    }

    await addActivity({
        type: 'task',
        actorId: deletedTask.assigneeId,
        projectId: deletedTask.projectId,
        title: 'Deleted a task',
        description: `${deletedTask.title} was removed from the delivery board.`,
        severity: 'Warning',
    });

    return deletedTask;
}

export async function listMembers() {
    return sortByNewest(await listCollection('members'), 'updatedAt');
}

export async function createMemberEntry(payload) {
    const createdMember = await createCollectionItem('members', payload);

    await addActivity({
        type: 'team',
        actorId: createdMember.id,
        title: 'Added a team member',
        description: `${createdMember.name} joined the workspace team roster.`,
        severity: 'Success',
    });

    return createdMember;
}

export async function updateMemberEntry(memberId, payload) {
    const updatedMember = await updateCollectionItem('members', memberId, payload);
    if (!updatedMember) {
        return null;
    }

    await addActivity({
        type: 'team',
        actorId: updatedMember.id,
        title: 'Updated team profile',
        description: `${updatedMember.name}'s capacity or profile details were refreshed.`,
        severity: 'Info',
    });

    return updatedMember;
}

export async function deleteMemberEntry(memberId) {
    const deletedMember = await deleteCollectionItem('members', memberId);
    if (!deletedMember) {
        return null;
    }

    await addActivity({
        type: 'team',
        actorId: memberId,
        title: 'Removed a team member',
        description: `${deletedMember.name} was removed from the team directory.`,
        severity: 'Warning',
    });

    return deletedMember;
}

export async function listReleases() {
    return sortByNewest(await listCollection('releases'), 'updatedAt');
}

export async function createReleaseEntry(payload) {
    const createdRelease = await createCollectionItem('releases', payload);

    await addActivity({
        type: 'release',
        actorId: createdRelease.ownerId,
        projectId: createdRelease.projectIds[0] || '',
        title: 'Created a release plan',
        description: `${createdRelease.name} (${createdRelease.version}) was scheduled.`,
        severity: 'Info',
    });

    return createdRelease;
}

export async function updateReleaseEntry(releaseId, payload) {
    const updatedRelease = await updateCollectionItem('releases', releaseId, payload);
    if (!updatedRelease) {
        return null;
    }

    await addActivity({
        type: 'release',
        actorId: updatedRelease.ownerId,
        projectId: updatedRelease.projectIds[0] || '',
        title: 'Updated release readiness',
        description: `${updatedRelease.name} is now marked as ${updatedRelease.status}.`,
        severity: updatedRelease.status === 'Released' ? 'Success' : 'Info',
    });

    return updatedRelease;
}

export async function deleteReleaseEntry(releaseId) {
    const deletedRelease = await deleteCollectionItem('releases', releaseId);
    if (!deletedRelease) {
        return null;
    }

    await addActivity({
        type: 'release',
        actorId: deletedRelease.ownerId,
        projectId: deletedRelease.projectIds[0] || '',
        title: 'Removed a release plan',
        description: `${deletedRelease.name} (${deletedRelease.version}) was removed.`,
        severity: 'Warning',
    });

    return deletedRelease;
}

export async function listActivities() {
    return sortByNewest(await listCollection('activities'), 'happenedAt');
}

export async function getSettings() {
    if (isDatabaseReady()) {
        await ensureSeedData();
        const settings = await Setting.findOne().lean();
        return normalizeEntity(settings);
    }

    return normalizeEntity(memoryStore.settings);
}

export async function updateSettings(payload) {
    const now = new Date().toISOString();

    if (isDatabaseReady()) {
        await ensureSeedData();
        const existingSettings = await Setting.findOne();
        const updatedSettings = await Setting.findByIdAndUpdate(
            existingSettings._id,
            {
                ...payload,
                updatedAt: now,
            },
            {
                new: true,
                runValidators: true,
            }
        ).lean();

        await addActivity({
            type: 'settings',
            title: 'Updated workspace settings',
            description: 'Workspace defaults, notifications, or release windows were updated.',
            severity: 'Info',
        });

        return normalizeEntity(updatedSettings);
    }

    memoryStore.settings = {
        ...memoryStore.settings,
        ...payload,
        updatedAt: now,
    };

    await addActivity({
        type: 'settings',
        title: 'Updated workspace settings',
        description: 'Workspace defaults, notifications, or release windows were updated.',
        severity: 'Info',
    });

    return normalizeEntity(memoryStore.settings);
}
