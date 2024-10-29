import express from 'express';
import { createHubWithAdmin, updateHubData } from "../Controllers/HubController";

const hubRoutes = express.Router();

hubRoutes.post('/onboardHub', createHubWithAdmin);

hubRoutes.put('/updateHub', updateHubData);

export default hubRoutes;
