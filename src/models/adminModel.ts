import mongoose, { Schema, Document } from 'mongoose';
import { IAdmin } from '../interfaces/IAdmin';

interface IAdminDocument extends IAdmin, Document {}

const AdminSchema: Schema = new Schema({
    readableId: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    emailId: { type: String, required: true},
    contactNumber: { type: String, required: true },
    password: { type: String, required: true },
    organizationId: { type: String, required: true },
});

const AdminModel = mongoose.model<IAdminDocument>('Admin', AdminSchema);
export default AdminModel;
