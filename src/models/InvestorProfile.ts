import mongoose from 'mongoose';

export interface IInvestorProfile extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  investmentInterests: string[];
  investmentStage: string[];
  portfolioCompanies: string[];
  totalInvestments: number;
  minimumInvestment: string;
  maximumInvestment: string;
  yearsOfExperience?: number;
  company?: string;
  createdAt: Date;
  updatedAt: Date;
}

const investorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    investmentInterests: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
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
        validator: function (v: string[]) {
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
  },
  {
    timestamps: true,
  }
);

export const InvestorProfile = mongoose.model<IInvestorProfile>(
  'InvestorProfile',
  investorProfileSchema
);
