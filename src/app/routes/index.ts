import { Router } from "express";
import userRouter from "../modules/user/user.routes";
import authRouter from "../modules/auth/auth.routes";
import scheduleRouter from "../modules/schedule/scedule.route";
import doctorScheduleRouter from "../modules/doctorSchedule/doctorSchedule.routes";

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
    }
]


moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

