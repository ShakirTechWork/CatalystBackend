import { Types } from "mongoose";

export function isValidMongoId(mongoId: Types.ObjectId): Boolean {
    return (mongoId && Types.ObjectId.isValid(mongoId))
} 