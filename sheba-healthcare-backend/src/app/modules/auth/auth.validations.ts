import z from 'zod'

const userLoginZodSchema = z.object({
    email: z.string('Email is required'),
    password: z.string(),
})

export const AuthValidations = {
    userLoginZodSchema
}
