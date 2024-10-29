import express from "express";
import { updateAdminData } from "../Controllers/AdminControllers";

const adminRoutes = express.Router();

adminRoutes.put("/updateAdmin", updateAdminData)

export default adminRoutes;