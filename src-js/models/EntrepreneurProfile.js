import mongoose from 'mongoose';
const entrepreneurProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    startupName: {
        type: String,
        required: [true, 'Please provide startup name'],
        trim: true,
        maxlength: 100,
    },
    pitchSummary: {
        type: String,
        required: [true, 'Please provide a pitch summary'],
        maxlength: 1000,
    },
    fundingNeeded: {
        type: String,
        required: [true, 'Please specify funding needed'],
        trim: true,
    },
    industry: {
        type: String,
        required: [true, 'Please specify industry'],
        trim: true,
    },
    location: {
        type: String,
        required: [true, 'Please provide location'],
        trim: true,
    },
    foundedYear: {
        type: Number,
        required: [true, 'Please provide founding year'],
        min: 1900,
        max: new Date().getFullYear(),
    },
    teamSize: {
        type: Number,
        required: [true, 'Please specify team size'],
        min: 1,
    },
    website: {
        type: String,
        trim: true,
    },
    socialLinks: {
        linkedin: String,
        twitter: String,
        github: String,
    },
}, {
    timestamps: true,
});
export const EntrepreneurProfile = mongoose.model('EntrepreneurProfile', entrepreneurProfileSchema);
