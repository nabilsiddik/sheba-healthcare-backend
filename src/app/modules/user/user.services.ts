import { Request } from "express";
import { prisma } from "../../config/db.config";
import AppError from "../../errorHelpers/appError";
import { createPatientInput } from "./user.interfaces";
import bcrypt from 'bcrypt'
import { fileUploader } from "../../utils/fileUploder";
import { envVars } from "../../config/env";

// Create patient
const createPatient = async (req: Request) => {

    if(req?.file){
        const uploadedResult = await fileUploader.uploadToCloudinary(req.file)
        req.body.patient.profilePhoto = uploadedResult?.secure_url
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: req?.body?.patient?.email }
    })

    if (existingUser) {
        throw new AppError(400, 'User with this email already exist.')
    }

    const hashedPassword = await bcrypt.hash(req?.body?.password, Number(envVars.SALT_ROUND))

    const result = await prisma.$transaction(async (tnx) => {
        const user = await tnx.user.create({
            data: {
                email: req?.body?.patient?.email,
                password: hashedPassword
            }
        })

        const patient = await tnx.patient.create({
            data: {
                name: req?.body?.patient?.name,
                email: req?.body?.patient?.email,
                profilePhoto: req?.body?.patient?.profilePhoto,
                gender: req?.body?.patient?.gender
            }
        })

        return { user, patient }
    })

    return result
}
 
export const UserServices = {
    createPatient
}