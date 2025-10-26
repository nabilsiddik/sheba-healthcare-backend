import { UserStatus } from "@prisma/client"
import { prisma } from "../../config/db.config"
import { userLoginInput } from "./auth.interfaces"
import bcrypt from 'bcrypt'
import AppError from "../../errorHelpers/appError"
import jwt from 'jsonwebtoken'
import { envVars } from "../../config/env"
import { generateJwtToken } from "../../utils/generateJwtToken"

// User login
const userLogin = async (payload: userLoginInput) => {
    const existingUser = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload?.email,
            status: UserStatus.ACTIVE
        }
    })

    const isPasswordMatch = await bcrypt.compare(payload?.password, existingUser?.password)

    if (!isPasswordMatch) {
        throw new AppError(400, 'Password is incorrect')
    }

    // Generate access Token
    const accessToken = generateJwtToken(
        {email: existingUser?.email, role: existingUser?.role},
        envVars.JWT.JWT_ACCESS_SECRET,
        '1h'
    )

    // Generate refresh Token
    const refreshToken = generateJwtToken(
        {email: existingUser?.email, role: existingUser?.role},
        envVars.JWT.JWT_REFRESH_SECRET,
        '30d'
    )
    
    return {
        accessToken,
        refreshToken,
        needPasswordChange: existingUser?.needPasswordChange
    }
}

export const AuthServices = {
    userLogin
}