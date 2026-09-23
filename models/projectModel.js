const mongoose = require('mongoose');

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
    }
);

module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema);
