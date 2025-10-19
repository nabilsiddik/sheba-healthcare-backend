import { Router } from "express";
import { ScheduleControllers } from "./scedule.controllers";
import { checkAuth } from "../../utils/checkAuth";
import { UserRole } from "@prisma/client";

const scheduleRouter = Router()

scheduleRouter.get('/', checkAuth(UserRole.ADMIN, UserRole.DOCTOR), ScheduleControllers.getAllSchedulesForDoctor)

scheduleRouter.post('/create', checkAuth(UserRole.ADMIN), ScheduleControllers.createSchedule)


export default scheduleRouter 