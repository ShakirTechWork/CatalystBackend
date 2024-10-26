import express from 'express';
import { createOrganizationWithAdmin } from "../controllers/organizationController";

const organizationRoutes = express.Router();

organizationRoutes.post('/onboard', createOrganizationWithAdmin);

export default organizationRoutes;
