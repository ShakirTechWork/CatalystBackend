import mongoose, {Schema, Document, Types} from "mongoose";
import { ITeam } from "../Interfaces/ITeam";

interface ITeamDocument extends ITeam, Document {
    _id: Types.ObjectId;
}

const TeamSchema: Schema = new Schema (
    {
        readableId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        colorCode: { type: String, required: true },
        hubMongoId: { type: Schema.Types.ObjectId, ref: 'Hub' },
        adminMongoId: { type: Schema.Types.ObjectId, ref: 'Admin' },
        teamLeaderMongoId: { type: String, required: true },
        teamMemberMongoIds: [{type: String, required: true}]
    },
    {
        timestamps: true
    }
)

const TeamModel = mongoose.model<ITeamDocument>("Team", TeamSchema)
export default TeamModel;