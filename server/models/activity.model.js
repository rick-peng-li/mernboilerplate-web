import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['project', 'task', 'release', 'team', 'settings'],
            required: true,
        },
        actorId: {
            type: String,
            default: '',
            trim: true,
        },
        projectId: {
            type: String,
            default: '',
            trim: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        severity: {
            type: String,
            enum: ['Info', 'Success', 'Warning'],
            default: 'Info',
        },
        happenedAt: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);
