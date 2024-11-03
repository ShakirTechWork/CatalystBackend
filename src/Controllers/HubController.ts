import { Types } from "mongoose";
import { Request, Response } from "express";
import HubModel from "../Models/HubModel";
import AdminModel from '../Models/AdminModel';
import { IOnboarding } from "../Interfaces/IOnboarding";
import { createUniqueId } from '../Utility/ReadableIdGenerator';
import asyncHandler from "express-async-handler"
import CatalystErrorCodes from "../ErrorHandling/CatalystStatusCodes";
import CatalystError from "../ErrorHandling/CatalystError"
import HttpStatusCodes from "../Enums/HttpStatusCodes";
import CollectionType from "../Enums/CollectionType";
import DbKeys from "../Enums/DbKeys"
import { isValidMongoId } from "../Utility/MongoDbObjectIdValidator";
import { UpdateHub } from "../Types.ts/UpdateHub";
import CatalystStatusCodes from "../ErrorHandling/CatalystStatusCodes";
import ifUserHasPrivilege from "../Utility/UserPrivilegeValidator";
import UserRoles from "../Enums/UserRoles";

export const createHubWithAdmin = asyncHandler(async (req: Request<{}, {}, IOnboarding>, res: Response) => {
  const { hub, admin } = req.body;

    const uniqueHubReadableId = await createUniqueId(CollectionType.HUB);

    const uniqueAdminReadableId = await createUniqueId(CollectionType.ADMIN);

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

    const newAdmin = new AdminModel({
      readableId: uniqueAdminReadableId,
      name: admin.name,
      emailId: admin.emailId,
      contactNumber: admin.contactNumber,
      password: admin.password,
      hubMongoId: savedHub._id,
    });
    const savedAdmin = await newAdmin.save();

    savedHub.adminMongoId = savedAdmin._id as Types.ObjectId
    await savedHub.save();

    res.status(HttpStatusCodes.CREATED).json({
      hub: {
        mongoId: savedHub._id,
        readableId: savedHub.readableId,
        name: savedHub.name,
        industry: savedHub.industry,
        contactNumber: savedHub.contactNumber,
        emailId: savedHub.emailId,
        websiteLink: savedHub.websiteLink,
        address: savedHub.address,
        adminMongoId: savedHub.adminMongoId,
      },
      admin: {
        mongoId: savedAdmin._id,
        readableId: savedAdmin.readableId,
        name: savedAdmin.name,
        emailId: savedAdmin.emailId,
        contactNumber: savedAdmin.contactNumber,
        hubMongoId: savedAdmin.hubMongoId
      }
    });
});



// API endpoint to update a Hub
export const updateHub = asyncHandler(async (req: Request<{}, {}, UpdateHub & { hubMongoId: string; adminMongoId: string }>, res: Response): Promise<void> => {
  const { hubMongoId, adminMongoId, ...updateFields } = req.body;

  if (!hubMongoId || !adminMongoId) {
    throw new CatalystError(HttpStatusCodes.NOT_FOUND, 
      CatalystStatusCodes.RESOURCE_NOT_FOUND, 
        undefined, 
        "Both hubMongoId and adminMongoId are required."
      );
  }

  const isValidHubMongoId = isValidMongoId(hubMongoId)
  if (!isValidHubMongoId) {
    throw new CatalystError(HttpStatusCodes.BAD_REQUEST, 
      CatalystStatusCodes.INVALID_INPUT, 
        undefined, 
        "Hub Mongo Object ID is not valid."
      );
  }

  const isValidAdminMongoId = isValidMongoId(adminMongoId)
  if (!isValidAdminMongoId) {
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

  const doAdminHasUpdateHubPermission = ifUserHasPrivilege(adminMongoId, UserRoles.ADMIN, hubMongoId, CollectionType.HUB)
  if (!doAdminHasUpdateHubPermission) {
    throw new CatalystError(HttpStatusCodes.BAD_REQUEST, 
      CatalystStatusCodes.INVALID_INPUT, 
        "You don't have permission to update this hub details.", 
        "Admin does not have permission to update this hub."
      );
  }

  // Ensure the provided hub exists and matches the admin ID
  const hub = await HubModel.findOne({ _id: hubMongoId, adminMongoId: adminMongoId });
  if (!hub) {
    throw new CatalystError(HttpStatusCodes.NOT_FOUND, 
      CatalystStatusCodes.RESOURCE_NOT_FOUND, 
        "Hub not found.", 
        "Hub not found."
      );
  }

  // Update the hub with the provided fields
  const updatedHub = await HubModel.findByIdAndUpdate(
    hubMongoId,
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  if (!updatedHub) {
    throw new CatalystError(HttpStatusCodes.NOT_FOUND, 
      CatalystStatusCodes.RESOURCE_NOT_FOUND, 
        "Hub not found.", 
        "Hub not found."
      );
  }

  res.status(HttpStatusCodes.OK).json({
    message: 'Hub updated successfully',
    hub: updatedHub,
  });
});

export const getHub = asyncHandler(async (req: Request<{}, {}, { hubMongoId: string; adminMongoId: string }>, res: Response): Promise<void> => {
  const { hubMongoId, adminMongoId } = req.body;

  if (!hubMongoId || !adminMongoId) {
    throw new CatalystError(HttpStatusCodes.NOT_FOUND, 
      CatalystStatusCodes.RESOURCE_NOT_FOUND, 
        undefined, 
        "Both hubMongoId and adminMongoId are required."
      );
  }

  const isValidHubMongoId = isValidMongoId(hubMongoId)
  if (!isValidHubMongoId) {
    throw new CatalystError(HttpStatusCodes.BAD_REQUEST, 
      CatalystStatusCodes.INVALID_INPUT, 
        undefined, 
        "Hub Mongo Object ID is not valid."
      );
  }

  const isValidAdminMongoId = isValidMongoId(adminMongoId)
  if (!isValidAdminMongoId) {
    throw new CatalystError(HttpStatusCodes.BAD_REQUEST, 
      CatalystStatusCodes.INVALID_INPUT, 
        undefined, 
        "Admin Mongo Object ID is not valid."
      );
  }

  const doAdminHasGetHubPermission = ifUserHasPrivilege(adminMongoId, UserRoles.ADMIN, hubMongoId, CollectionType.HUB)
  if (!doAdminHasGetHubPermission) {
    throw new CatalystError(HttpStatusCodes.BAD_REQUEST, 
      CatalystStatusCodes.INVALID_INPUT, 
        "You don't have permission to update this hub details.", 
        "Admin does not have permission to update this hub."
      );
  }

  const hub = await HubModel.findOne({ _id: hubMongoId, adminMongoId: adminMongoId })
    .select("-_id name industry contactNumber emailId websiteLink address") // Use generated select fields
    .exec();

  if (!hub) {
    throw new CatalystError(HttpStatusCodes.NOT_FOUND, 
      CatalystStatusCodes.RESOURCE_NOT_FOUND, 
        "Hub not found.", 
        "Hub not found."
      );
  }

  res.status(HttpStatusCodes.OK).json({
    hub
  });

});

export const deleteHub = asyncHandler(async(req: Request<{},{},{
  adminMongoId: string, adminReadableId: string,
  adminPassword: string, hubMongoId: string, hubReadableId: string
  }>, res: Response) => {
  const { adminMongoId, adminReadableId, adminPassword, hubMongoId, hubReadableId } = req.body;
console.log("ckjbcijvecfihev")
  if (!adminMongoId || !adminReadableId || !adminPassword || !hubMongoId || !hubReadableId) {
    throw new CatalystError(HttpStatusCodes.NOT_FOUND, 
      CatalystStatusCodes.RESOURCE_NOT_FOUND, 
        undefined, 
        "Give all the details for deleting a hub and its related data."
      );
  }

  const isValidHubMongoId = isValidMongoId(hubMongoId)
  if (!isValidHubMongoId) {
    throw new CatalystError(HttpStatusCodes.BAD_REQUEST, 
      CatalystStatusCodes.INVALID_INPUT, 
        undefined, 
        "Hub Mongo Object ID is not valid."
      );
  }

  const isValidAdminMongoId = isValidMongoId(adminMongoId)
  if (!isValidAdminMongoId) {
    throw new CatalystError(HttpStatusCodes.BAD_REQUEST, 
      CatalystStatusCodes.INVALID_INPUT, 
        undefined, 
        "Admin Mongo Object ID is not valid."
      );
  }

  const admin = await AdminModel.findOne({_id: adminMongoId, readableId: adminReadableId});
  if (!admin) {
    throw new CatalystError(
      HttpStatusCodes.NOT_FOUND,
      CatalystErrorCodes.RESOURCE_NOT_FOUND,
      "Admin Details not found.",
      "Admin details not found for the provided admin mongo and readable id."
    )
  }

  if (admin.password !== adminPassword) {
    throw new CatalystError(
      HttpStatusCodes.UNAUTHORIZED,
      CatalystErrorCodes.USER_NOT_AUTHENTICATED,
      "Incorrect Admin Password.",
      "Incorrect Admin Password."
    )
  }

  // Attempt to find and delete the hub
  const hub = await HubModel.findOneAndDelete({ _id: hubMongoId, readableId: hubReadableId, adminMongoId: adminMongoId });
  if (!hub) {
    throw new CatalystError(
      HttpStatusCodes.NOT_FOUND,
      CatalystErrorCodes.RESOURCE_NOT_FOUND,
      "Hub not found or you do not have permission to delete this hub.",
      "Either hub is not found or the admin doesn't have permission to delete the Hub."
    )
  }

  const deleteAdmin = await AdminModel.findOneAndDelete({ _id: adminMongoId, readableId: adminReadableId });
  if (!deleteAdmin) {
    throw new CatalystError(
      HttpStatusCodes.NOT_FOUND,
      CatalystErrorCodes.RESOURCE_NOT_FOUND,
      "Admin not found or you do not have permission to delete the Admin.",
      "Either Admin is not found or the admin doesn't have permission to delete the account."
    )
  }

  res.status(200).json({ message: 'Hub and all its related data deleted successfully.', hub });

});