import mongoose from 'mongoose';

const releaseSchema = new mongoose.Schema(
    {
        version: {
            type: String,
            required: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['Planned', 'Ready', 'Released'],
            default: 'Planned',
        },
        ownerId: {
            type: String,
            required: true,
            trim: true,
        },
        projectIds: {
            type: [String],
            default: [],
        },
        taskIds: {
            type: [String],
            default: [],
        },
        releaseDate: {
            type: String,
            default: '',
            trim: true,
        },
        summary: {
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

export const Release = mongoose.models.Release || mongoose.model('Release', releaseSchema);
