import {Request, Response} from "express"
import OrganizationModel from '../models/organizationModel';
import AdminModel from '../models/adminModel';

export const createOrganizationWithAdmin = async (req: Request, res: Response) => {
  try {
    const { organization, admin } = req.body;

    // Create and save the organization
    console.log("organizationData", organization.name)
    const newOrganization = new OrganizationModel(organization);
    const savedOrganization = await newOrganization.save();

    // Create and save the admin, linking it to the organization's ID
    const newAdmin = new AdminModel({
      ...admin,
      organizationId: savedOrganization._id,
    });
    const savedAdmin = await newAdmin.save();

    res.status(201).json({ organization: savedOrganization, admin: savedAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create organization and admin' });
  }
};
