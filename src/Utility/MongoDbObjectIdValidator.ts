import mongoose, { Types } from "mongoose";

export function isValidMongoId(mongoId: string): Boolean {
    const objectId = new mongoose.Types.ObjectId(mongoId);
    return (objectId && Types.ObjectId.isValid(objectId))
}