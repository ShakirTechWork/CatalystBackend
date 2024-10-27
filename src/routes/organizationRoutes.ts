import express from 'express';
import { createOrganizationWithAdmin } from "../Controllers/OrganizationController";

const organizationRoutes = express.Router();

organizationRoutes.post('/onboard', createOrganizationWithAdmin);

export default organizationRoutes;
