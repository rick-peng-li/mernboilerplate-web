import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['Planned', 'In Progress', 'Completed'],
            default: 'Planned',
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            default: 'Medium',
        },
        health: {
            type: String,
            enum: ['Healthy', 'Watch', 'At Risk'],
            default: 'Healthy',
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        summary: {
            type: String,
            required: true,
            trim: true,
        },
        stack: {
            type: [String],
            default: [],
        },
        ownerId: {
            type: String,
            required: true,
            trim: true,
        },
        memberIds: {
            type: [String],
            default: [],
        },
        repoUrl: {
            type: String,
            default: '',
            trim: true,
        },
        demoUrl: {
            type: String,
            default: '',
            trim: true,
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

export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
