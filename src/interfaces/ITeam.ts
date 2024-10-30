import { Types } from "mongoose";

export interface ITeam {
    readableId: string,
    name: string,
    colorCode: string,
    hubMongoId: string,
    adminMongoId: string,
    teamLeaderMongoId: string,
    teamMemberMongoIds: Types.ObjectId[]
}