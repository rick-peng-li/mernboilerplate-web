import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        summary: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['Todo', 'In Progress', 'Review', 'Done'],
            default: 'Todo',
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            default: 'Medium',
        },
        projectId: {
            type: String,
            required: true,
            trim: true,
        },
        assigneeId: {
            type: String,
            required: true,
            trim: true,
        },
        releaseId: {
            type: String,
            default: '',
            trim: true,
        },
        estimate: {
            type: Number,
            default: 0,
            min: 0,
        },
        dueDate: {
            type: String,
            default: '',
            trim: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
