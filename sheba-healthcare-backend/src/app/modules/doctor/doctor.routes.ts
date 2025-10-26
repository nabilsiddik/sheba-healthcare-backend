import express from "express";
import { DoctorControllers } from "./doctor.controllers";
const doctorRouter = express.Router();

doctorRouter.get(
    "/",
    DoctorControllers.getAllDoctors
)
doctorRouter.get(
    "/:id",
    DoctorControllers.getDoctorById
)
doctorRouter.post('/suggession', DoctorControllers.getAISuggessions)

doctorRouter.patch(
    "/:id",
    DoctorControllers.updateDoctor
)
export default doctorRouter