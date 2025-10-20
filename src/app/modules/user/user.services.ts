import { Request } from "express";
import { prisma } from "../../config/db.config";
import AppError from "../../errorHelpers/appError";
import bcrypt from 'bcrypt'
import { fileUploader } from "../../utils/fileUploder";
import { envVars } from "../../config/env";
import { Prisma, UserRole } from "@prisma/client";
import calculatePagination from "../../utils/pagination";
import { userSearchableFields } from "./user.constants";
import { StatusCodes } from "http-status-codes";


// Get all users from db
const getAllUsers = async (params: any, options: any) => {
    const { page, limit, skip, sortOrder, sortBy } = calculatePagination(options)
    const { searchTerm, ...filterData } = params

    const andConditions: Prisma.UserWhereInput[] = []

    if (searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }

    if(Object.keys(filterData).length > 0){
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        })
    }

    const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {}

    const total = await prisma.user.count({
        where: whereConditions
    })

    const result = await prisma.user.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy: {
            [sortBy]: sortOrder
        }
    })

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    }
}


// Create patient
const createPatient = async (req: Request) => {

    if (req?.file) {
        const uploadedResult = await fileUploader.uploadToCloudinary(req.file)
        req.body.patient.profilePhoto = uploadedResult?.secure_url
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: req?.body?.patient?.email }
    })

    if(existingUser){
        throw new AppError(StatusCodes.BAD_REQUEST, 'An account with this email already exist.')
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
    if (req?.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req?.file)
        req.body.admin.profilePhoto = uploadResult?.secure_url
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: req.body.admin.email }
    })

     if(existingUser){
        throw new AppError(StatusCodes.BAD_REQUEST, 'An account with this email already exist.')
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, Number(envVars.SALT_ROUND))

    const userData = {
        email: req.body.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    }

    const result = prisma.$transaction(async (tnx) => {
        const createdUser = await tnx.user.create({
            data: userData
        })

        const createdAdmin = await tnx.admin.create({
            data: req.body.admin
        })

        return { createdUser, createdAdmin }
    })

    return result
}


// Create Doctor
const createDoctor = async (req: Request) => {
    if (req?.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req?.file)
        req.body.doctor.profilePhoto = uploadResult?.secure_url
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: req.body.doctor.email }
    })

     if(existingUser){
        throw new AppError(StatusCodes.BAD_REQUEST, 'An account with this email already exist.')
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, Number(envVars.SALT_ROUND))

    const userData = {
        email: req.body.doctor.email,
        password: hashedPassword,
        role: UserRole.DOCTOR
    }

    const result = prisma.$transaction(async (tnx) => {
        const createdUser = await tnx.user.create({
            data: userData
        })

        const createdDoctor = await tnx.doctor.create({
            data: req.body.doctor
        })

        return { createdUser, createdDoctor }
    })

    return result
}




export const UserServices = {
    getAllUsers,
    createPatient,
    createAdmin,
    createDoctor
}