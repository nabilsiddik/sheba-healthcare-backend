import express from "express";
import { AppointmentControllers } from "./appointment.controllers";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";
const appointmentRoute = express.Router();


appointmentRoute.get(
    "/my-appointments",
    checkAuth(UserRole.PATIENT, UserRole.DOCTOR),
    AppointmentControllers.getMyAppointment
)

appointmentRoute.post(
    "/",
    checkAuth(UserRole.PATIENT),
    AppointmentControllers.bookAppointment
)

appointmentRoute.patch(
    "/status/:id",
    checkAuth(UserRole.ADMIN, UserRole.DOCTOR),
    AppointmentControllers.updateAppointmentStatus
)

export default appointmentRoute
