import { Gender } from "@prisma/client"

export type createPatientInput = {
    patient: {
        name: string,
        email: string,
        address?: string,
        gender: Gender
    },
    password: string
}