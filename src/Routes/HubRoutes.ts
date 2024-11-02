import express from 'express';
import { createHubWithAdmin, getHub, updateHub } from "../Controllers/HubController";

const hubRoutes = express.Router();

hubRoutes.post('/onboardHub', createHubWithAdmin);

hubRoutes.put('/updateHub', updateHub);

hubRoutes.get('/getHub', getHub);

export default hubRoutes;
