import { Router } from "express";
import { AuthControllers } from "./auth.controllers";

const authRouter = Router()

authRouter.post('/login', AuthControllers.userLogin)


export default authRouter 