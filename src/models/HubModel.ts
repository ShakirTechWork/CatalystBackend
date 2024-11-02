import mongoose, { Schema, Document, Types } from 'mongoose';
import { IHub } from '../Interfaces/IHub';

// Define Mongoose Document interface based on IHub
export interface IHubDocument extends IHub, Document {}

// Define Mongoose Schema
const HubSchema = new Schema<IHubDocument>({
    readableId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    industry: { type: String, required: true },
    contactNumber: { type: String, required: true },
    emailId: { type: String, required: true },
    websiteLink: { type: String, required: true },
    address: { type: String },
    adminMongoId: { type: Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

const HubModel = mongoose.model<IHubDocument>('Hub', HubSchema);
export default HubModel;