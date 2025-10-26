import express from "express";
import { AppointmentControllers } from "./appointment.controllers";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";
const appointmentRoute = express.Router();

appointmentRoute.post(
    "/",
    checkAuth(UserRole.PATIENT),
    AppointmentControllers.bookAppointment
)

export default appointmentRoute
