import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { isValidMongoId } from "../Utility/MongoDbObjectIdValidator";
import CatalystError from "../ErrorHandling/CatalystError";
import CatalystStatusCodes from "../ErrorHandling/CatalystStatusCodes";
import HttpStatusCodes from "../Enums/HttpStatusCodes";
import ifUserHasPrivilege from "../Utility/UserPrivilegeValidator";
import UserRoles from "../Enums/UserRoles";
import CollectionType from "../Enums/CollectionType";


export const createTeam = expressAsyncHandler(async(req: Request, res: Response) => {
    const {adminMongoId, hubMongoId, team} = req.body;
    if (!isValidMongoId(adminMongoId)) {
        throw new CatalystError(HttpStatusCodes.BAD_REQUEST, 
            CatalystStatusCodes.INVALID_INPUT, 
            undefined, 
            "Admin Mongo Object ID is not valid."
          );
    }

    if (!isValidMongoId(hubMongoId)) {
        throw new CatalystError(HttpStatusCodes.BAD_REQUEST, 
            CatalystStatusCodes.INVALID_INPUT, 
            undefined, 
            "Admin Mongo Object ID is not valid."
          );
    }

    const userHasPrivilege = ifUserHasPrivilege(adminMongoId, UserRoles.ADMIN, hubMongoId, CollectionType.HUB)
    if (!userHasPrivilege) {
        throw new CatalystError(HttpStatusCodes.UNAUTHORIZED, 
            CatalystStatusCodes.USER_NOT_AUTHENTICATED, 
            "You don't have permission to create a team for this Hub.", 
            "Admin don't have permission to create a team for this Hub."
          );
    }
})