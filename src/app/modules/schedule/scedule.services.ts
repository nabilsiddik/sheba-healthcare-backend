import { addMinutes, addHours, format } from 'date-fns'
import { prisma } from '../../config/db.config'
import calculatePagination from '../../utils/pagination'
import { Prisma } from '@prisma/client'
import AppError from '../../errorHelpers/appError'
import { JWTPayload } from '../../interfaces'


// Get all Schedules for doctor
const getAllSchedulesForDoctor = async(filters: any, options: any, user: JWTPayload) => {
    const { page, limit, skip, sortOrder, sortBy } = calculatePagination(options)
    const { startDateTime: filterStartDateTime, endDateTime: filterEndDateTime } = filters

    const andConditions: Prisma.ScheduleWhereInput[] = []

    if (filterStartDateTime && filterEndDateTime) {
        andConditions.push({
            AND: [
                {
                    startDateTime: {
                        gte: filterStartDateTime
                    }
                },
                {
                    endDateTime: {
                        lte: filterEndDateTime
                    }
                }
            ]
        })
    }


    const whereConditions: Prisma.ScheduleWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {}

    const doctorSchedules = await prisma.doctorSchedule.findMany({
        where: {
            doctor: {
                email: user.email
            }
        },
        select: {
            scheduleId: true
        }
    })

    const doctorScheduleIds = doctorSchedules.map(schedule => schedule.scheduleId)

    console.log(doctorScheduleIds)

    const result = await prisma.schedule.findMany({
        skip,
        take: limit,
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
        },
        orderBy: {
            [sortBy]: sortOrder
        }
    })

    
    const total = await prisma.schedule.count({
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
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


// Create schedule by admin
const createSchedule = async (payload: any) => {
    const { startDate, endDate, startTime, endTime } = payload
    const intervalTime = 30

    const schedules = []

    const currentDate = new Date(startDate)
    const lastDate = new Date(endDate)

    while (currentDate <= lastDate) {
        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, 'yyyy-MM-dd')}`,
                    Number(startTime.split(':')[0])
                ),
                Number(startTime.split(":")[1])
            )
        )

        const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, 'yyyy-MM-dd')}`,
                    Number(endTime.split(':')[0])
                ),
                Number(startTime.split(":")[1])
            )
        )


        while (startDateTime <= endDateTime) {
            const slotStartDateTime = startDateTime
            const slotEndDateTime = addMinutes(startDateTime, intervalTime)

            const scheduleData = {
                startDateTime: slotStartDateTime,
                endDateTime: slotEndDateTime
            }

            const existingSchedule = await prisma.schedule.findFirst({
                where: scheduleData
            })

            if (existingSchedule) {
                throw new Error('Schedule is already available.')
            }

            const result = await prisma.schedule.create({
                data: scheduleData
            })

            schedules.push(result)

            slotStartDateTime.setMinutes(slotStartDateTime.getMinutes() + intervalTime)
        }

        currentDate.setDate(currentDate.getDate() + 1)
    }

    return schedules

}


// Delete a schedule
const deleteSchedule = async(scheduleId: string) => {
    const schedule = await prisma.schedule.findUnique({
        where: {
            id: scheduleId
        }
    })

    if(!schedule){
        throw new AppError(404, 'Schedule not found')
    }

    const result = prisma.schedule.delete({
        where: {
            id: scheduleId
        }
    }) 

    return result
}

export const ScheduleServices = {
    createSchedule,
    getAllSchedulesForDoctor,
    deleteSchedule
}