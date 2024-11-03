import { Types } from "mongoose";
import { Request, Response } from "express";
import AdminModel, {IAdminDocument} from '../Models/AdminModel';
import asyncHandler from "express-async-handler"
import CatalystStatusCodes from "../ErrorHandling/CatalystStatusCodes";
import CatalystError from "../ErrorHandling/CatalystError"
import HttpStatusCodes from "../Enums/HttpStatusCodes";
import DbKeys from "../Enums/DbKeys"
import { isValidMongoId } from "../Utility/MongoDbObjectIdValidator";
import { UpdateAdmin } from "../Types.ts/UpdateAdmin";
import ifUserHasPrivilege from "../Utility/UserPrivilegeValidator";
import UserRoles from "../Enums/UserRoles";
import CollectionType from "../Enums/CollectionType";

// Function to handle admin data update
export const updateAdminData = asyncHandler(async (req: Request, res: Response) => {
    const { adminMongoId, admin } = req.body;

    if (!isValidMongoId(adminMongoId)) {
        throw new CatalystError(HttpStatusCodes.BAD_REQUEST, 
          CatalystStatusCodes.INVALID_INPUT, 
            undefined, 
            "Admin Mongo Object ID is not valid."
          );
    }
  
    // Convert to ObjectId to avoid type inconsistencies
    // Ensure id is passed as a string and directly create the ObjectId
    const objectId = new Types.ObjectId(String(adminMongoId));
    const validFields: (keyof IAdminDocument)[] = [
      DbKeys.NAME, DbKeys.CONTACT_NUMBER, DbKeys.EMAIL_ID
  ];
  
    const updateData: Partial<IAdminDocument> = {};
    for (const field of validFields) {
        if (admin[field] !== undefined) {
            updateData[field] = admin[field];
        }
    }
  
    // First check if document exists
    const adminToUpdate = await AdminModel.findById(objectId);
  
    if (!adminToUpdate) {
        throw new CatalystError(HttpStatusCodes.NOT_FOUND, 
          CatalystStatusCodes.RESOURCE_NOT_FOUND, 
          undefined, 
          "Hub not found."
        );
    }
  
    const updatedAdmin = await AdminModel.findByIdAndUpdate(
        objectId,
        { $set: updateData },
        { new: true, runValidators: true }
    );
  
    if (!updatedAdmin) {
        throw new CatalystError(HttpStatusCodes.NOT_FOUND, 
          CatalystStatusCodes.RESOURCE_NOT_FOUND, 
          undefined, 
          "Hub not found after updating."
        );
    }
  
    res.status(HttpStatusCodes.OK).json({ admin: updatedAdmin });
  });

export const updateAdmin = asyncHandler(async(req: Request<{},{},UpdateAdmin & { adminMongoId: string }>, res: Response) => {
  const { adminMongoId, ...updateFields } = req.body;

  if (!adminMongoId) {
    throw new CatalystError(HttpStatusCodes.NOT_FOUND, 
      CatalystStatusCodes.RESOURCE_NOT_FOUND, 
        undefined, 
        "adminMongoId are required."
      );
  }

  if (!isValidMongoId(adminMongoId)) {
    throw new CatalystError(HttpStatusCodes.BAD_REQUEST, 
      CatalystStatusCodes.INVALID_INPUT, 
        undefined, 
        "Admin Mongo Object ID is not valid."
      );
  }

  // Verify updateFields has keys to update
  if (Object.keys(updateFields).length === 0) {
    throw new CatalystError(
      HttpStatusCodes.BAD_REQUEST,
      CatalystStatusCodes.INVALID_INPUT,
      "No fields provided for update.",
      "No fields to update."
    );
  }


  const doAdminHasPermission = ifUserHasPrivilege(adminMongoId, UserRoles.ADMIN, adminMongoId, CollectionType.ADMIN);
  if (!doAdminHasPermission) {
    throw new CatalystError(HttpStatusCodes.BAD_REQUEST, 
      CatalystStatusCodes.INVALID_INPUT, 
        "You don't have permission to update the admin details.", 
        "Admin does not have permission to update."
      );
  }

  // Update the admin with the provided fields
  const updatedAdmin = await AdminModel.findByIdAndUpdate(
    adminMongoId,
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  if (!updatedAdmin) {
    throw new CatalystError(HttpStatusCodes.NOT_FOUND, 
      CatalystStatusCodes.RESOURCE_NOT_FOUND, 
        "Admin not found.", 
        "Admin not found."
      );
  }

  res.status(HttpStatusCodes.OK).json({
    message: 'Admin updated successfully',
    admin: updatedAdmin,
  });

});