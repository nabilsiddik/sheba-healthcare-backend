import { UserStatus } from "@prisma/client"
import { prisma } from "../../config/db.config"
import { userLoginInput } from "./auth.interfaces"
import bcrypt from 'bcrypt'
import AppError from "../../errorHelpers/appError"
import jwt, { Secret, SignOptions } from 'jsonwebtoken'
import { envVars } from "../../config/env"
import { generateJwtToken, verifyToken } from "../../utils/generateJwtToken"
import { StatusCodes } from "http-status-codes"
import emailSender from "./emailSender"

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

// Generate accesstoken by refreshtoken
const refreshToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = verifyToken(token, envVars.JWT.JWT_REFRESH_SECRET as Secret);
    }
    catch (err) {
        throw new Error("You are not authorized!")
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: UserStatus.ACTIVE
        }
    });

    const accessToken = generateJwtToken({
        email: userData.email,
        role: userData.role
    },
        envVars.JWT.JWT_ACCESS_SECRET as Secret,
        envVars.JWT.JWT_ACCESS_EXPIRES as SignOptions["expiresIn"]
    );

    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange
    };

};


// change password
const changePassword = async (user: any, payload: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        }
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Password incorrect!")
    }

    const hashedPassword: string = await bcrypt.hash(payload.newPassword, Number(envVars.SALT_ROUND));

    await prisma.user.update({
        where: {
            email: userData.email
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    })

    return {
        message: "Password changed successfully!"
    }
};

// Forgot password
const forgotPassword = async (payload: { email: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    const resetPassToken = generateJwtToken(
        { email: userData.email, role: userData.role },
        envVars.JWT.JWT_RESET_PASSWORD_SECRET as Secret,
        envVars.JWT.JWT_RESET_PASSWORD_EXPIRES as SignOptions['expiresIn']
    )

    const resetPassLink = envVars.RESET_PASS_URL + `?userId=${userData.id}&token=${resetPassToken}`

    await emailSender(
        userData.email,
        `
        <div>
            <p>Dear User,</p>
            <p>Your password reset link 
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>

        </div>
        `
    )
};


const resetPassword = async (token: string, payload: { id: string, password: string }) => {

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: UserStatus.ACTIVE
        }
    });

    const isValidToken = verifyToken(token, envVars.JWT.JWT_RESET_PASSWORD_SECRET as Secret)

    if (!isValidToken) {
        throw new AppError(StatusCodes.FORBIDDEN, "Forbidden!")
    }

    // hash password
    const password = await bcrypt.hash(payload.password, Number(envVars.SALT_ROUND));

    // update into database
    await prisma.user.update({
        where: {
            id: payload.id
        },
        data: {
            password
        }
    })
};

// Get current loged in user
const getMe = async (session: any) => {
    const accessToken = session.accessToken;
    const decodedData = verifyToken(accessToken, envVars.JWT.JWT_ACCESS_SECRET as Secret);

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: UserStatus.ACTIVE
        }
    })

    const { id, email, role, needPasswordChange, status } = userData;

    return {
        id,
        email,
        role,
        needPasswordChange,
        status
    }

}



export const AuthServices = {
    userLogin,
    changePassword,
    forgotPassword,
    refreshToken,
    resetPassword,
    getMe
}