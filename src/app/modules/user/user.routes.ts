import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controllers";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { fileUploader } from "../../utils/fileUploder";

const userRouter = Router()

userRouter.post('/create-patient', 
    fileUploader.upload.single('file'),
    async(req: Request, res: Response, next: NextFunction) => {
       try{
            const parsedData = await UserValidation.createPatientValidationSchema.parseAsync(JSON.parse(req.body.data))
            req.body = parsedData
       return UserControllers.createUser(req, res, next)
       }catch(err){
            next(err)
       }
    }
)


export default userRouter