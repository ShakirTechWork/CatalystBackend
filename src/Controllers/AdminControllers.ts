import { Types } from "mongoose";
import { Request, Response } from "express";
import AdminModel, {IAdminDocument} from '../Models/AdminModel';
import asyncHandler from "express-async-handler"
import CatalystStatusCodes from "../ErrorHandling/CatalystStatusCodes";
import CatalystError from "../ErrorHandling/CatalystError"
import HttpStatusCodes from "../Enums/HttpStatusCodes";
import DbKeys from "../Enums/DbKeys"
import { isValidMongoId } from "../Utility/MongoDbObjectIdValidator";

// Function to handle admin data update
export const updateAdminData = asyncHandler(async (req: Request, res: Response) => {
    const { currentUserMongoId, admin } = req.body;

    if (!isValidMongoId(currentUserMongoId)) {
        throw new CatalystError(HttpStatusCodes.BAD_REQUEST, 
          CatalystStatusCodes.INVALID_INPUT, 
            undefined, 
            "Admin Mongo Object ID is not valid."
          );
    }
  
    // Convert to ObjectId to avoid type inconsistencies
    // Ensure id is passed as a string and directly create the ObjectId
    const objectId = new Types.ObjectId(String(currentUserMongoId));
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