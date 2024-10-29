import { Types } from "mongoose";

export interface ITeam {
    readableId: string,
    name: string,
    colorCode: string,
    hubId: string,
    adminId: string,
    teamLeaderId: string,
    teamMemberIds: Types.ObjectId[]
}