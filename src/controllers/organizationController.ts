import { Types } from "mongoose";
import { Request, Response } from "express";
import OrganizationModel from '../Models/OrganizationModel';
import AdminModel from '../Models/AdminModel';
import { IOnboarding } from "../Interfaces/IOnboarding";
import { createUniqueId } from '../Utility/ReadableIdGenerator';
import asyncHandler from "express-async-handler"
import CatalystErrorCodes from "../ErrorHandling/CatalystErrorCodes";
import CatalystError from "../ErrorHandling/CatalystError"
import HttpStatusCodes from "../ErrorHandling/HttpStatusCodes";
import CollectionType from "../enums/CollectionType";
import { isUniqueData } from "../Utility/UniqueDataValidator"
import KeyType from "../enums/KeyType";

export const createOrganizationWithAdmin = asyncHandler(async (req: Request<{}, {}, IOnboarding>, res: Response) => {
  const { organization, admin } = req.body;

    // Generate a unique readable ID for the organization
    const uniqueOrgReadableId = await createUniqueId(CollectionType.ORGANIZATION);

    const sameOrgNameExists = await isUniqueData(CollectionType.ORGANIZATION, KeyType.NAME, organization.name)
    if (sameOrgNameExists) {
      throw new CatalystError(HttpStatusCodes.BAD_REQUEST, 
        CatalystErrorCodes.DUPLICATE_ENTRY, 
        "The Organization name is already taken. Please give a unique organization name.", 
        "Found same organization name already."
      );
    }

    const sameOrgEmailIdExists = await isUniqueData(CollectionType.ORGANIZATION, KeyType.EMAIL, organization.emailId)
    if (sameOrgEmailIdExists) {
      throw new CatalystError(HttpStatusCodes.BAD_REQUEST,
         CatalystErrorCodes.DUPLICATE_ENTRY,
          "The Organization Email ID is already taken. Please give a unique Organization Email ID.", 
          "Found same organization Email ID already."
        );
    }

    const uniqueAdminReadableId = await createUniqueId(CollectionType.ADMIN);

    const sameAdminNameExists = await isUniqueData(CollectionType.ADMIN, KeyType.NAME, admin.name)
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
    }

    // Create and save the organization with individual fields
    const newOrganization = new OrganizationModel({
      readableId: uniqueOrgReadableId,
      name: organization.name,
      industry: organization.industry,
      contactNumber: organization.contactNumber,
      emailId: organization.emailId,
      websiteLink: organization.websiteLink,
      address: organization.address
    });

    const savedOrganization = await newOrganization.save();

    // After saving the organization, create and save the admin, linking it to the organization's ID
    const newAdmin = new AdminModel({
      readableId: uniqueAdminReadableId,
      name: admin.name,
      emailId: admin.emailId,
      contactNumber: admin.contactNumber,
      password: admin.password,
      organizationId: savedOrganization._id,
    });
    const savedAdmin = await newAdmin.save();

    // Update the adminId in the saved organization with the newly created admin's ID
    savedOrganization.adminId = (savedAdmin._id as Types.ObjectId).toString();
    await savedOrganization.save();

    // Respond with the saved organization and admin data
    res.status(HttpStatusCodes.CREATED).json({ organization: savedOrganization, admin: savedAdmin });
});
