import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controllers";
import { UserValidation } from "./user.validation";
import { fileUploader } from "../../utils/fileUploder";
import { UserRole } from "@prisma/client";
import { checkAuth } from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";

const userRouter = Router()


// Get all users 
userRouter.get('/', checkAuth(UserRole.ADMIN), UserControllers.getAllUsers)

// Ceate patient route
userRouter.post('/create-patient',
     fileUploader.upload.single('file'),
     validateRequest(UserValidation.createPatientValidationSchema),
     UserControllers.createPatient
)

// Ceate admin route
userRouter.post('/create-admin',
     checkAuth(UserRole.ADMIN),
     fileUploader.upload.single('file'),
     validateRequest(UserValidation.createAdminValidationSchema),
     UserControllers.createAdmin
)

// Ceate doctor route
userRouter.post('/create-doctor',
     checkAuth(UserRole.ADMIN),
     fileUploader.upload.single('file'),
     validateRequest(UserValidation.createDoctorValidationSchema),
     UserControllers.createDoctor
)


export default userRouter