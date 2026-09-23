import {
    createTaskEntry,
    deleteTaskEntry,
    listTasks,
    updateTaskEntry,
} from '../services/workspace.service.js';

export async function getTasks(req, res) {
    const tasks = await listTasks();
    const { assigneeId, projectId, status } = req.query;

    const filteredTasks = tasks.filter((task) => {
        if (assigneeId && task.assigneeId !== assigneeId) {
            return false;
        }

        if (projectId && task.projectId !== projectId) {
            return false;
        }

        if (status && task.status !== status) {
            return false;
        }

        return true;
    });

    res.json(filteredTasks);
}

export async function postTask(req, res) {
    const createdTask = await createTaskEntry(req.validatedBody);
    res.status(201).json(createdTask);
}

export async function putTask(req, res) {
    const updatedTask = await updateTaskEntry(req.params.taskId, req.validatedBody);

    if (!updatedTask) {
        return res.status(404).json({
            message: 'Task not found.',
        });
    }

    return res.json(updatedTask);
}

export async function removeTask(req, res) {
    const deletedTask = await deleteTaskEntry(req.params.taskId);

    if (!deletedTask) {
        return res.status(404).json({
            message: 'Task not found.',
        });
    }

    return res.json({
        message: 'Task deleted successfully.',
        task: deletedTask,
    });
}
