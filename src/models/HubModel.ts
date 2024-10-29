import mongoose, { Schema, Document } from 'mongoose';
import { IHub } from "../Interfaces/IHub";

export interface IHubDocument extends IHub, Document {}

const HubSchema: Schema = new Schema({
  readableId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  industry: { type: String, required: true },
  contactNumber: { type: String, required: true },
  emailId: { type: String, required: true },
  websiteLink: { type: String, required: true },
  address: { type: String },
  adminId: { type: Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

const HubModel = mongoose.model<IHubDocument>('Hub', HubSchema);
export default HubModel;