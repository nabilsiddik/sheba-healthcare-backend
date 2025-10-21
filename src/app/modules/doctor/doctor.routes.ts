import express from "express";
import { DoctorControllers } from "./doctor.controllers";
const doctorRouter = express.Router();

doctorRouter.get(
    "/",
    DoctorControllers.getAllDoctors
)

doctorRouter.patch(
    "/:id",
    DoctorControllers.updateDoctor
)
export default doctorRouter