import mongoose, { Schema, Document } from 'mongoose';
import { IOrganization } from "../Interfaces/IOrganization";

export interface IOrganizationDocument extends IOrganization, Document {}

const OrganizationSchema: Schema = new Schema({
  readableId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  industry: { type: String, required: true },
  contactNumber: { type: String, required: true },
  emailId: { type: String, required: true },
  websiteLink: { type: String, required: true },
  address: { type: String },
  adminId: { type: String },
}, { timestamps: true });

const OrganizationModel = mongoose.model<IOrganizationDocument>('Organization', OrganizationSchema);
export default OrganizationModel;