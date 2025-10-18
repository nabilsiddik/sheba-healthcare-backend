import { NextFunction, Request, RequestHandler, Response } from "express"
import { verifyToken } from "./generateJwtToken"
import { envVars } from "../config/env"

export const checkAuth = (...roles: string[]) => {
    return async (req: Request & {user?: any}, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies.accessToken

            if (!token) {
                throw new Error('Token not found')
            }

            const verifiedToken = verifyToken(token, envVars.JWT.JWT_ACCESS_SECRET)

            if (!verifiedToken) {
                throw new Error('You is not authorized')
            }

            req.user = verifyToken

            if(roles.length && !roles.includes(verifiedToken.role)){
                throw new Error('You are not authorized')
            }

            next()

        }catch(err: unknown){
            next(err)
        }
    }
}