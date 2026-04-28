"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntrepreneurProfile = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const entrepreneurProfileSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
exports.EntrepreneurProfile = mongoose_1.default.model('EntrepreneurProfile', entrepreneurProfileSchema);
