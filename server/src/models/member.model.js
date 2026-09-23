import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            default: '',
            trim: true,
        },
        timezone: {
            type: String,
            default: '',
            trim: true,
        },
        allocation: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        capacity: {
            type: Number,
            default: 100,
            min: 0,
            max: 100,
        },
        skills: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ['Active', 'Away'],
            default: 'Active',
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Member = mongoose.models.Member || mongoose.model('Member', memberSchema);
