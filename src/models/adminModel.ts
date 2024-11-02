import mongoose, { Schema, Document, Types } from 'mongoose';
import { IAdmin } from '../Interfaces/IAdmin';

export interface IAdminDocument extends IAdmin, Document {
    readableId: string;
    hubMongoId: Types.ObjectId;
}

const AdminSchema: Schema = new Schema({
    readableId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    emailId: { type: String, required: true },
    contactNumber: { type: String, required: true },
    password: { type: String, required: true },
    hubMongoId: { type: Schema.Types.ObjectId, ref: 'Hub' }
}, { timestamps: true });

const AdminModel = mongoose.model<IAdminDocument>('Admin', AdminSchema);
export default AdminModel;
