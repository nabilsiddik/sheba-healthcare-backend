import { Gender } from '@prisma/client'
import z from 'zod'

const createPatientValidationSchema = z.object({
    password: z.string(),
    patient: z.object({
        name: z.string('Name is required'),
        email: z.string('Email is required'),
        address: z.string().optional(),
        gender: z.enum(['MALE', 'FEMALE', 'OTHERS'], {
            error: 'Gender is required and must be one of MALE, FEMALE or OTHERS'
        }),
        profilePhoto: z.string().optional()
    })
})

export const UserValidation = {
    createPatientValidationSchema
}
