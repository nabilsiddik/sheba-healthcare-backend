import { Router } from "express";
import { AuthControllers } from "./auth.controllers";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";

const authRouter = Router()

authRouter.post('/login', AuthControllers.userLogin)

authRouter.get(
    "/me",
    AuthControllers.getMe
)

authRouter.post(
    '/refresh-token',
    AuthControllers.refreshToken
)

authRouter.post(
    '/change-password',
    checkAuth(
        UserRole.ADMIN,
        UserRole.DOCTOR,
        UserRole.PATIENT
    ),
    AuthControllers.changePassword
);

authRouter.post(
    '/forgot-password',
    AuthControllers.forgotPassword
);

authRouter.post(
    '/reset-password',
    AuthControllers.resetPassword
)


export default authRouter 