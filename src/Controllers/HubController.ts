import { Types } from "mongoose";
import { Request, Response } from "express";
import HubModel, { IHubDocument} from '../Models/HubModel';
import AdminModel from '../Models/AdminModel';
import { IOnboarding } from "../Interfaces/IOnboarding";
import { createUniqueId } from '../Utility/ReadableIdGenerator';
import asyncHandler from "express-async-handler"
import CatalystErrorCodes from "../ErrorHandling/CatalystStatusCodes";
import CatalystError from "../ErrorHandling/CatalystError"
import HttpStatusCodes from "../Enums/HttpStatusCodes";
import CollectionType from "../Enums/CollectionType";
import { isUniqueData } from "../Utility/UniqueDataValidator"
import KeyType from "../Enums/KeyType";
import DbKeys from "../Enums/DbKeys"

export const createHubWithAdmin = asyncHandler(async (req: Request<{}, {}, IOnboarding>, res: Response) => {
  const { hub, admin } = req.body;

    // Generate a unique readable ID for the hub
    const uniqueHubReadableId = await createUniqueId(CollectionType.HUB);

    /*const sameHubNameExists = await isUniqueData(CollectionType.HUB, KeyType.NAME, hub.name)
    if (sameHubNameExists) {
      throw new CatalystError(HttpStatusCodes.BAD_REQUEST, 
        CatalystErrorCodes.DUPLICATE_ENTRY, 
        "The Hub name is already taken. Please give a unique hub name.", 
        "Found same Hub name already."
      );
    }

    const sameHubEmailIdExists = await isUniqueData(CollectionType.HUB, KeyType.EMAIL, hub.emailId)
    if (sameHubEmailIdExists) {
      throw new CatalystError(HttpStatusCodes.BAD_REQUEST,
         CatalystErrorCodes.DUPLICATE_ENTRY,
          "The Hub Email ID is already taken. Please give a unique Hub Email ID.", 
          "Found same HUb Email ID already."
        );
    }*/

    const uniqueAdminReadableId = await createUniqueId(CollectionType.ADMIN);

    /*const sameAdminNameExists = await isUniqueData(CollectionType.ADMIN, KeyType.NAME, admin.name)
    if (sameAdminNameExists) {
      throw new CatalystError(HttpStatusCodes.BAD_REQUEST, 
        CatalystErrorCodes.DUPLICATE_ENTRY, 
        "The Admin name is already taken. Please give a unique Admin name.", 
        "Found same Admin name already."
      );
    }

    const sameAdminEmailIdExists = await isUniqueData(CollectionType.ADMIN, KeyType.EMAIL, admin.emailId)
    if (sameAdminEmailIdExists) {
      throw new CatalystError(HttpStatusCodes.BAD_REQUEST,
         CatalystErrorCodes.DUPLICATE_ENTRY,
          "The Admin Email ID is already taken. Please give a unique Admin Email ID.", 
          "Found same Admin Email ID already."
        );
    }*/

    // Create and save the HUb with individual fields
    const newHub = new HubModel({
      readableId: uniqueHubReadableId,
      name: hub.name,
      industry: hub.industry,
      contactNumber: hub.contactNumber,
      emailId: hub.emailId,
      websiteLink: hub.websiteLink,
      address: hub.address
    });

    const savedHub = await newHub.save();

    // After saving the Hub, create and save the admin, linking it to the Hub's ID
    const newAdmin = new AdminModel({
      readableId: uniqueAdminReadableId,
      name: admin.name,
      emailId: admin.emailId,
      contactNumber: admin.contactNumber,
      password: admin.password,
      hubId: savedHub._id,
    });
    const savedAdmin = await newAdmin.save();

    // Update the adminId in the saved hub with the newly created admin's ID
    savedHub.adminId = (savedAdmin._id as Types.ObjectId).toString();
    await savedHub.save();

    // Respond with the saved hub and admin data
    res.status(HttpStatusCodes.CREATED).json({ hub: savedHub, admin: savedAdmin });
});


// Function to handle hub data update
export const updateHubData = asyncHandler(async (req: Request, res: Response) => {
  const { current_user_id, id, hub } = req.body;

  if (!id || !Types.ObjectId.isValid(id)) {
      throw new CatalystError(HttpStatusCodes.BAD_REQUEST, 
        CatalystErrorCodes.INVALID_INPUT, 
        undefined, 
        "Hub ID is not valid."
      );
  }

  // Convert to ObjectId to avoid type inconsistencies
  // Ensure id is passed as a string and directly create the ObjectId
  const objectId = new Types.ObjectId(String(id));

  const validFields: (keyof IHubDocument)[] = [
    DbKeys.NAME, DbKeys.INDUSTRY, DbKeys.CONTACT_NUMBER, DbKeys.EMAIL_ID, DbKeys.WEBSITE_LINK, DbKeys.ADDRESS
];

  const updateData: Partial<IHubDocument> = {};
  for (const field of validFields) {
      if (hub[field] !== undefined) {
          updateData[field] = hub[field];
      }
  }

  // First check if document exists
  const hubToUpdate = await HubModel.findById(objectId);

  if (!hubToUpdate) {
      throw new CatalystError(HttpStatusCodes.NOT_FOUND, 
        CatalystErrorCodes.RESOURCE_NOT_FOUND, 
        undefined, 
        "Hub not found."
      );
  }

  const updatedHub = await HubModel.findByIdAndUpdate(
      objectId,
      { $set: updateData },
      { new: true, runValidators: true }
  );

  if (!updatedHub) {
      throw new CatalystError(HttpStatusCodes.NOT_FOUND, 
        CatalystErrorCodes.RESOURCE_NOT_FOUND, 
        undefined, 
        "Hub not found after updating."
      );
  }

  res.status(HttpStatusCodes.OK).json({ hub: updatedHub });
});
