import HubModel from "../Models/HubModel";
import AdminModel, { IAdminDocument } from "../Models/AdminModel";
import UserRoles from "../Enums/UserRoles";
import CollectionType from "../Enums/CollectionType";
import CatalystError from "../ErrorHandling/CatalystError";
import HttpStatusCodes from "../Enums/HttpStatusCodes";
import CatalystStatusCodes from "../ErrorHandling/CatalystStatusCodes";

async function ifUserHasPrivilege(
  currentUserObjectId: string,
  userRole: UserRoles,
  collectionObjectId: string,
  collectionType: CollectionType
): Promise<boolean> {
  switch (userRole) {
    case UserRoles.ADMIN:
      switch (collectionType) {
        case CollectionType.HUB:
          return await checkAdminHubPrivilege(currentUserObjectId, collectionObjectId);
        case CollectionType.ADMIN:
          return await checkAdminPrivilege(currentUserObjectId, collectionObjectId);
        case CollectionType.TEAM:
            return await checkAdminHubPrivilege(currentUserObjectId, collectionObjectId);
        case CollectionType.SALESMEN:
            return await checkAdminHubPrivilege(currentUserObjectId, collectionObjectId);
        case CollectionType.LEAD:
            return await checkAdminHubPrivilege(currentUserObjectId, collectionObjectId);
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
            //   return await checkTeamLeaderHubPrivilege(currentUserObjectId, collectionObjectId);
            return await checkAdminHubPrivilege(currentUserObjectId, collectionObjectId);
        case CollectionType.SALESMEN:
            return await checkAdminHubPrivilege(currentUserObjectId, collectionObjectId);
        case CollectionType.LEAD:
            return await checkAdminHubPrivilege(currentUserObjectId, collectionObjectId);
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
            return await checkAdminHubPrivilege(currentUserObjectId, collectionObjectId);
        case CollectionType.LEAD:
            return await checkAdminHubPrivilege(currentUserObjectId, collectionObjectId);
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


async function checkAdminHubPrivilege(currentUserObjectId: string, collectionObjectId: string): Promise<boolean> {
  // Fetch the hub and verify if the admin has privileges over it
  const hub = await HubModel.findById(collectionObjectId);
  if (!hub) {
    throw new CatalystError(HttpStatusCodes.NOT_FOUND,
       CatalystStatusCodes.RESOURCE_NOT_FOUND, 
       "Hub not found", "No Hub found.")
  }
  return hub.adminId === currentUserObjectId;
}

async function checkAdminPrivilege(currentUserObjectId: string, collectionObjectId: string): Promise<boolean> {
  // Verify if the admin can access this specific collection
//   const admin = await AdminModel.findById(collectionObjectId);
const admin = (await AdminModel.findById(collectionObjectId)) as IAdminDocument | null; // Use type assertion here
if (!admin) {
  throw new CatalystError(HttpStatusCodes.NOT_FOUND,
     CatalystStatusCodes.RESOURCE_NOT_FOUND, 
     "Admin not found", "No Admin found.")
}
  return admin?._id.toString() === currentUserObjectId;
}

export default ifUserHasPrivilege;
