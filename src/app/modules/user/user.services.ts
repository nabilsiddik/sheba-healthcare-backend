import { Request } from "express";
import { prisma } from "../../config/db.config";
import AppError from "../../errorHelpers/appError";
import { createPatientInput } from "./user.interfaces";
import bcrypt from 'bcrypt'
import { fileUploader } from "../../utils/fileUploder";
import { envVars } from "../../config/env";
import { UserRole, UserStatus } from "@prisma/client";

// Create patient
const createPatient = async (req: Request) => {

    if(req?.file){
        const uploadedResult = await fileUploader.uploadToCloudinary(req.file)
        req.body.patient.profilePhoto = uploadedResult?.secure_url
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: req?.body?.patient?.email }
    })

    if(existingUser){
        throw new AppError(400, 'A user with this email already exist.')
    }

    const hashedPassword = await bcrypt.hash(req?.body?.password, Number(envVars.SALT_ROUND))

    const result = await prisma.$transaction(async (tnx) => {
        const createdUser = await tnx.user.create({
            data: {
                email: req?.body?.patient?.email,
                password: hashedPassword
            }
        })

        const createdPatient = await tnx.patient.create({
            data: {
                name: req?.body?.patient?.name,
                email: req?.body?.patient?.email,
                profilePhoto: req?.body?.patient?.profilePhoto,
                gender: req?.body?.patient?.gender
            }
        })

        return { createdUser, createdPatient }
    })

    return result
}

// Create admin
const createAdmin = async (req: Request) => {
    if(req?.file){
        const uploadResult = await fileUploader.uploadToCloudinary(req?.file)
        req.body.admin.profilePhoto = uploadResult?.secure_url
    }

    const existingUser = await prisma.user.findUnique({
        where: {email: req.body.admin.email}
    })

    if(existingUser){
        throw new AppError(400, 'A user with this email already exist.')
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, Number(envVars.SALT_ROUND))

    const userData = {
        email: req.body.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    }

    const result = prisma.$transaction(async(tnx) => {
        const createdUser = await tnx.user.create({
            data: userData
        })

        const createdAdmin = await tnx.admin.create({
            data: req.body.admin
        })

        return {createdUser, createdAdmin}
    })

    return result
}


// Create Doctor
const createDoctor = async (req: Request) => {
    if(req?.file){
        const uploadResult = await fileUploader.uploadToCloudinary(req?.file)
        req.body.doctor.profilePhoto = uploadResult?.secure_url
    }

    const existingUser = await prisma.user.findUnique({
        where: {email: req.body.doctor.email}
    })

    if(existingUser){
        throw new AppError(400, 'A user with this email already exist.')
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, Number(envVars.SALT_ROUND))

    const userData = {
        email: req.body.doctor.email,
        password: hashedPassword,
        role: UserRole.DOCTOR
    }

    const result = prisma.$transaction(async(tnx) => {
        const createdUser = await tnx.user.create({
            data: userData
        })

        const createdDoctor = await tnx.doctor.create({
            data: req.body.doctor
        })

        return {createdUser, createdDoctor}
    })

    return result
}
 


 
export const UserServices = {
    createPatient,
    createAdmin,
    createDoctor
}