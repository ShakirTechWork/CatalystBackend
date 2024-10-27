import mongoose, { Schema, Document } from 'mongoose';
import { IAdmin } from '../Interfaces/IAdmin';

interface IAdminDocument extends IAdmin, Document {}

const AdminSchema: Schema = new Schema({
    readableId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    emailId: { type: String, required: true },
    contactNumber: { type: String, required: true },
    password: { type: String, required: true },
    organizationId: { type: String, required: true }
}, { timestamps: true });

const AdminModel = mongoose.model<IAdminDocument>('Admin', AdminSchema);
export default AdminModel;
