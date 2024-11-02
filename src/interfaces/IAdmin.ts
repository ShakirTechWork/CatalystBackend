import { Types } from "mongoose";

export interface IAdmin {
    readableId: string;
    name: string;
    emailId: string;
    contactNumber: string;
    password: string;
    hubMongoId: string | Types.ObjectId;
}