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
        summary: {
            type: String,
            required: true,
            trim: true,
        },
        stack: {
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
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
