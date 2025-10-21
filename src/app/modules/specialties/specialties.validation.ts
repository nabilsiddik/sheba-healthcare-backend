import { z } from "zod";

const createSpecialtiesZodSchema = z.object({
    title: z.string({
        error: "Title is required!"
    })
});

export const SpecialtiesValidtaions = {
    createSpecialtiesZodSchema
}