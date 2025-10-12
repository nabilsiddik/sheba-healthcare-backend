import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controllers";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { fileUploader } from "../../utils/fileUploder";

const userRouter = Router()

// Ceate patient route
userRouter.post('/create-patient', 
    fileUploader.upload.single('file'),
    async(req: Request, res: Response, next: NextFunction) => {
       try{
            const parsedData = await UserValidation.createPatientValidationSchema.parseAsync(JSON.parse(req.body.data))
            req.body = parsedData
       return UserControllers.createPatient(req, res, next)
       }catch(err){
            next(err)
       }
    }
)

// Ceate admin route
userRouter.post('/create-admin', 
    fileUploader.upload.single('file'),
    async(req: Request, res: Response, next: NextFunction) => {
       try{
            const parsedData = await UserValidation.createAdminValidationSchema.parseAsync(JSON.parse(req.body.data))
            req.body = parsedData
       return UserControllers.createAdmin(req, res, next)
       }catch(err){
            next(err)
       }
    }
)

// Ceate doctor route
userRouter.post('/create-doctor', 
    fileUploader.upload.single('file'),
    async(req: Request, res: Response, next: NextFunction) => {
       try{
            const parsedData = await UserValidation.createDoctorValidationSchema.parseAsync(JSON.parse(req.body.data))
            req.body = parsedData
       return UserControllers.createDoctor(req, res, next)
       }catch(err){
            next(err)
       }
    }
)


export default userRouter