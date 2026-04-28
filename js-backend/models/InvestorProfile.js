"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestorProfile = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const investorProfileSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    investmentInterests: {
        type: [String],
        default: [],
        validate: {
            validator: function (v) {
                return Array.isArray(v) && v.length > 0;
            },
            message: 'Please specify at least one investment interest',
        },
    },
    investmentStage: {
        type: [String],
        enum: ['seed', 'series_a', 'series_b', 'series_c', 'growth', 'exit'],
        default: [],
        validate: {
            validator: function (v) {
                return Array.isArray(v) && v.length > 0;
            },
            message: 'Please select at least one investment stage',
        },
    },
    portfolioCompanies: {
        type: [String],
        default: [],
    },
    totalInvestments: {
        type: Number,
        default: 0,
        min: 0,
    },
    minimumInvestment: {
        type: String,
        required: [true, 'Please specify minimum investment amount'],
        trim: true,
    },
    maximumInvestment: {
        type: String,
        required: [true, 'Please specify maximum investment amount'],
        trim: true,
    },
    yearsOfExperience: {
        type: Number,
        min: 0,
        max: 70,
    },
    company: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});
exports.InvestorProfile = mongoose_1.default.model('InvestorProfile', investorProfileSchema);
