import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['Admin', 'Manager', 'Member'],
            default: 'Member',
        },
        status: {
            type: String,
            enum: ['Active', 'Invited'],
            default: 'Active',
        },
        lastLoginAt: {
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

export const User = mongoose.models.User || mongoose.model('User', userSchema);
