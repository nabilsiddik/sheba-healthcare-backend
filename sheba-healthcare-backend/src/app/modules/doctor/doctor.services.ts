import { Doctor, Prisma } from "@prisma/client";
import calculatePagination, { IOptions } from "../../utils/pagination";
import { doctorSearchableFields } from "./doctor.constants";
import { prisma } from "../../config/db.config";
import { IDoctorUpdateInput } from "./doctor.interfaces";
import AppError from "../../errorHelpers/appError";
import { StatusCodes } from "http-status-codes";
import { openai } from "../../helpers/shebaOpenRouterAi";
import { extractJsonFromMessage } from "../../helpers/extractJsonFromMessage";

// Get all doctors
const getAllDoctors = async (filters: any, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
    const { searchTerm, specialties, ...filterData } = filters;

    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }

    if (specialties && specialties.length > 0) {
        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialities: {
                        title: {
                            contains: specialties,
                            mode: "insensitive"
                        }
                    }
                }
            }
        })
    }

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: (filterData as any)[key]
            }
        }))

        andConditions.push(...filterConditions)
    }

    const whereConditions: Prisma.DoctorWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
    });

    const total = await prisma.doctor.count({
        where: whereConditions
    })

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }
}

// Get doctor by id
const getDoctorById = async (id: string): Promise<Doctor | null> => {
    const result = await prisma.doctor.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true,
                },
            },
            doctorSchedules: {
                include: {
                    schedule: true
                }
            },
            reviews: true
        },
    });
    return result;
};

// Update doctor
const updateDoctor = async (id: string, payload: Partial<IDoctorUpdateInput>) => {
    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
        where: {
            id
        }
    });

    const { specialties, ...doctorData } = payload;

    return await prisma.$transaction(async (tnx) => {
        if (specialties && specialties.length > 0) {
            const deleteSpecialtyIds = specialties.filter((specialty) => specialty.isDeleted);

            for (const specialty of deleteSpecialtyIds) {
                await tnx.doctorSpecialties.deleteMany({
                    where: {
                        doctorId: id,
                        specialitiesId: specialty.specialtyId
                    }
                })
            }

            const createSpecialtyIds = specialties.filter((specialty) => !specialty.isDeleted);

            for (const specialty of createSpecialtyIds) {
                await tnx.doctorSpecialties.create({
                    data: {
                        doctorId: id,
                        specialitiesId: specialty.specialtyId
                    }
                })
            }

        }

        const updatedData = await tnx.doctor.update({
            where: {
                id: doctorInfo.id
            },
            data: doctorData,
            include: {
                doctorSpecialties: {
                    include: {
                        specialities: true
                    }
                }
            }

        })

        return updatedData
    })


}

// Get AI Suggessions
const getAISuggessions = async (payload: { symptoms: string }) => {
    if (!(payload && payload.symptoms)) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Symtoms is required')
    }

    const doctors = await prisma.doctor.findMany({
        where: { isDeleted: false },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
    })

    console.log('doctors data loaded')
    // Prompt
    const prompt = `
        You are a medical assistant AI. Based on the patient's symptoms, suggest the top 3 most suitable doctors.
        Each doctor has specialties and years of experience.
        Only suggest doctors who are relevant to the given symptoms.

        Symptoms: ${payload.symptoms}

        Here is the doctor list (in JSON):
        ${JSON.stringify(doctors, null, 2)}

        Return your response in JSON format with full individual doctor data. 
    `;

    console.log('doctors data analyzing...')
    const completion = await openai.chat.completions.create({
        model: 'z-ai/glm-4.5-air:free',
        messages: [
            {
                role: 'system',
                content: 'You are a helpful AI medical assistant that provides doctor suggestions.',
            },
            {
                role: 'user',
                content: prompt
            }
        ],
    });

    const result = extractJsonFromMessage(completion.choices[0].message)

    return result
}

export const DoctorServices = {
    getAllDoctors,
    updateDoctor,
    getAISuggessions,
    getDoctorById
} 