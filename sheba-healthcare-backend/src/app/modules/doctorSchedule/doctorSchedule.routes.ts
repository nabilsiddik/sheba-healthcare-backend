import { Router } from "express";
import { UserRole } from "@prisma/client";
import { DoctorScheduleControllers } from "./doctorSchedule.controllers";
import { checkAuth } from "../../middlewares/checkAuth";

const doctorScheduleRouter = Router()

doctorScheduleRouter.get('/', checkAuth(UserRole.DOCTOR), DoctorScheduleControllers.getLogedInDoctorSchedules)
doctorScheduleRouter.post('/', checkAuth(UserRole.DOCTOR), DoctorScheduleControllers.createDoctorSchedule)

export default doctorScheduleRouter 