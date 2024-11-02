import express from 'express';
import { createHubWithAdmin, deleteHub, getHub, updateHub } from "../Controllers/HubController";

const hubRoutes = express.Router();

hubRoutes.post('/onboardHub', createHubWithAdmin);

hubRoutes.put('/updateHub', updateHub);

hubRoutes.get('/getHub', getHub);

hubRoutes.delete("/deleteHub", deleteHub);

export default hubRoutes;
