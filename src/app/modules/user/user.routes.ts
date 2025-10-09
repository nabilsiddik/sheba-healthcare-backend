import { Router } from "express";

const userRouter = Router()

userRouter.get('/', () => {
    return 'Hello user'
})


export default userRouter