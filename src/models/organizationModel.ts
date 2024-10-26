import mongoose, { Schema, Document } from 'mongoose';
import { IOrganization } from "../interfaces/IOrganization";

interface IOrganizationDocument extends IOrganization, Document {}

const OrganizationSchema: Schema = new Schema({
  readableId: { type: String, required: true },
  name: { type: String, required: true },
  industry: { type: String, required: true },
  contactNumber: { type: String, required: true },
  emailID: { type: String, required: true },
  websiteLink: { type: String, required: true },
  address: { type: String },
  adminId: { type: String },
});

const OrganizationModel = mongoose.model<IOrganizationDocument>('Organization', OrganizationSchema);
export default OrganizationModel;