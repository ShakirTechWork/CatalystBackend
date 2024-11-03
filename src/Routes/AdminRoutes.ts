import express from "express";
import { updateAdmin, updateAdminData } from "../Controllers/AdminControllers";

const adminRoutes = express.Router();

adminRoutes.put("/updateAdmin", updateAdmin)

export default adminRoutes;