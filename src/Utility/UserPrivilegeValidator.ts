import HubModel from "../Models/HubModel";
import AdminModel, { IAdminDocument } from "../Models/AdminModel";
import UserRoles from "../Enums/UserRoles";
import CollectionType from "../Enums/CollectionType";
import CatalystError from "../ErrorHandling/CatalystError";
import HttpStatusCodes from "../Enums/HttpStatusCodes";
import CatalystStatusCodes from "../ErrorHandling/CatalystStatusCodes";

async function ifUserHasPrivilege(
  currentUserMongoId: string,
  userRole: UserRoles,
  collectionMongoId: string,
  collectionType: CollectionType
): Promise<boolean> {
  switch (userRole) {
    case UserRoles.ADMIN:
      switch (collectionType) {
        case CollectionType.HUB:
          return await checkAdminHubPrivilege(currentUserMongoId, collectionMongoId);
        case CollectionType.ADMIN:
          return await checkAdminPrivilege(currentUserMongoId, collectionMongoId);
        case CollectionType.TEAM:
            return await checkAdminHubPrivilege(currentUserMongoId, collectionMongoId);
        case CollectionType.SALESMEN:
            return await checkAdminHubPrivilege(currentUserMongoId, collectionMongoId);
        case CollectionType.LEAD:
            return await checkAdminHubPrivilege(currentUserMongoId, collectionMongoId);
        default:
            throw new CatalystError(
                        HttpStatusCodes.NOT_FOUND,
                        CatalystStatusCodes.RESOURCE_NOT_FOUND,
                        undefined,
                        "Collection not found while validating privileges."
                    )
      }

    case UserRoles.TEAM_LEADER:
      switch (collectionType) {
        case CollectionType.HUB:
            return false;
        case CollectionType.ADMIN:
            return false
        case CollectionType.TEAM:
            //   return await checkTeamLeaderHubPrivilege(currentUserMongoId, collectionMongoId);
            return await checkAdminHubPrivilege(currentUserMongoId, collectionMongoId);
        case CollectionType.SALESMEN:
            return await checkAdminHubPrivilege(currentUserMongoId, collectionMongoId);
        case CollectionType.LEAD:
            return await checkAdminHubPrivilege(currentUserMongoId, collectionMongoId);
        default:
            throw new CatalystError(
                HttpStatusCodes.NOT_FOUND,
                CatalystStatusCodes.RESOURCE_NOT_FOUND,
                undefined,
                "Collection not found while validating privileges."
            )
      }

    case UserRoles.SALESMAN:
      switch (collectionType) {
        case CollectionType.HUB:
            return false;
        case CollectionType.ADMIN:
            return false;
        case CollectionType.TEAM:
            return false;
        case CollectionType.SALESMEN:
            return await checkAdminHubPrivilege(currentUserMongoId, collectionMongoId);
        case CollectionType.LEAD:
            return await checkAdminHubPrivilege(currentUserMongoId, collectionMongoId);
        default:
            throw new CatalystError(
                HttpStatusCodes.NOT_FOUND,
                CatalystStatusCodes.RESOURCE_NOT_FOUND,
                undefined,
                "Collection not found while validating privileges."
            )
      }

    default:
        throw new CatalystError(
            HttpStatusCodes.NOT_FOUND,
            CatalystStatusCodes.RESOURCE_NOT_FOUND,
            undefined,
            "Collection not found while validating privileges."
        )
  }
}


async function checkAdminHubPrivilege(currentUserMongoId: string, collectionMongoId: string): Promise<boolean> {
  // Fetch the hub and verify if the admin has privileges over it
  const hub = await HubModel.findById(collectionMongoId);
  if (!hub) {
    throw new CatalystError(HttpStatusCodes.NOT_FOUND,
       CatalystStatusCodes.RESOURCE_NOT_FOUND, 
       "Hub not found", "No Hub found.")
  }
  return hub.adminMongoId === currentUserMongoId;
}

async function checkAdminPrivilege(currentUserMongoId: string, collectionMongoId: string): Promise<boolean> {
  // Verify if the admin can access this specific collection
//   const admin = await AdminModel.findById(collectionMongoId);
const admin = (await AdminModel.findById(collectionMongoId)) as IAdminDocument | null; // Use type assertion here
if (!admin) {
  throw new CatalystError(HttpStatusCodes.NOT_FOUND,
     CatalystStatusCodes.RESOURCE_NOT_FOUND, 
     "Admin not found", "No Admin found.")
}
  return admin?._id === currentUserMongoId;
}

export default ifUserHasPrivilege;
