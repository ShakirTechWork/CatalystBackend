import { Types } from "mongoose";

export function isValidMongoObjectId(objectId: Types.ObjectId): Boolean {
    return (objectId && Types.ObjectId.isValid(objectId))
} 