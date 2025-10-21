import { Router } from "express";
import userRouter from "../modules/user/user.routes";
import authRouter from "../modules/auth/auth.routes";
import scheduleRouter from "../modules/schedule/scedule.route";
import doctorScheduleRouter from "../modules/doctorSchedule/doctorSchedule.routes";
import specialtiesRouter from "../modules/specialties/specialties.routes";
import doctorRouter from "../modules/doctor/doctor.routes";

export const router = Router()

const moduleRoutes = [
    {
        path: '/user',
        route: userRouter
    },
    {
        path: '/auth',
        route: authRouter
    },
    {
        path: '/schedule',
        route: scheduleRouter
    },
    {
        path: '/doctor-schedule',
        route: doctorScheduleRouter
    },
    {
        path: '/specialties',
        route: specialtiesRouter
    },
    {
        path: '/doctor',
        route: doctorRouter
    }
]


moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

