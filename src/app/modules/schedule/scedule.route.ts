import { Router } from "express";
import { ScheduleControllers } from "./scedule.controllers";
import { UserRole } from "@prisma/client";
import { checkAuth } from "../../middlewares/checkauth";

const scheduleRouter = Router()

scheduleRouter.get('/', checkAuth(UserRole.ADMIN, UserRole.DOCTOR), ScheduleControllers.getAllSchedulesForDoctor)

scheduleRouter.post('/create', checkAuth(UserRole.ADMIN), ScheduleControllers.createSchedule)

scheduleRouter.delete('/:id', checkAuth(UserRole.ADMIN), ScheduleControllers.deleteSchedule)


export default scheduleRouter 