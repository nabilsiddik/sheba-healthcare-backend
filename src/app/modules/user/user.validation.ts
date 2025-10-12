import { Gender } from '@prisma/client'
import z from 'zod'

// patient creation input zod schema
const createPatientValidationSchema = z.object({
    password: z.string(),
    patient: z.object({
        name: z.string('Name is required'),
        email: z.string('Email is required'),
        address: z.string().optional(),
        gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHERS], {
            error: 'Gender is required and must be one of MALE, FEMALE or OTHERS'
        }),
        profilePhoto: z.string().optional()
    })
})

// admin creation input zod schema
const createAdminValidationSchema = z.object({
    password: z.string(),
    admin: z.object({
        name: z.string('Name is required'),
        email: z.string('Email is required'),
        contactNumber: z.string('Contact number is required'),
        profilePhoto: z.string().optional()
    })
})

// doctor creation input zod schema
const createDoctorValidationSchema = z.object({
    password: z.string(),
    doctor: z.object({
        name: z.string('Name is required'),
        email: z.string('Email is required'),
        address: z.string().optional(),
        gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHERS], {
            error: 'Gender is required and must be one of MALE, FEMALE or OTHERS'
        }),
        profilePhoto: z.string().optional(),
        contactNumber: z.string('Contact number is required'),
        registrationNumber: z.string('Registration number is required.').min(6, 'Registration number should be minimum 6 digits').max(6, 'Registration number should be maximum 6 digits'),
        appointmentFee: z.number('Appointment fee is required.'),
        qualification: z.string('Qualification is required.'),
        designation: z.string('Designation is required.'),
    })
})

export const UserValidation = {
    createPatientValidationSchema,
    createAdminValidationSchema,
    createDoctorValidationSchema
}
