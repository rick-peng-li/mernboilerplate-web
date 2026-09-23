import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
    {
        workspaceName: {
            type: String,
            required: true,
            trim: true,
        },
        defaultView: {
            type: String,
            required: true,
            trim: true,
        },
        timezone: {
            type: String,
            required: true,
            trim: true,
        },
        dailyDigestTime: {
            type: String,
            required: true,
            trim: true,
        },
        releaseWindow: {
            type: String,
            required: true,
            trim: true,
        },
        notifications: {
            email: {
                type: Boolean,
                default: true,
            },
            slack: {
                type: Boolean,
                default: true,
            },
            browser: {
                type: Boolean,
                default: true,
            },
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Setting = mongoose.models.Setting || mongoose.model('Setting', settingSchema);
