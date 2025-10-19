import { addMinutes, addHours, format } from 'date-fns'
import { prisma } from '../../config/db.config'
import calculatePagination from '../../utils/pagination'
import { Prisma } from '@prisma/client'
import AppError from '../../errorHelpers/appError'
import { JWTPayload } from '../../interfaces'


// Get all Schedules for doctor
const getLogedInDoctorSchedules = async(user: JWTPayload) => {
    console.log(user)

    const doctor = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })

    const logedInDoctorSchedules = await prisma.doctorSchedule.findMany({
        where: {
            doctorId: doctor.id
        }
    })

    return logedInDoctorSchedules
}


// Create doctor schedules
const createDoctorSchedules = async (payload: {
    scheduleIds: string[]
}, user: JWTPayload) => {
    const doctor = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })

    const doctorScheduleData = payload.scheduleIds.map(scheduleId => ({
        doctorId: doctor.id,
        scheduleId
    }))

    console.log(doctorScheduleData)

    const createdSchedules = await Promise.all(
        doctorScheduleData.map(async (schedule) => {
            try {
                return await prisma.doctorSchedule.create({
                    data: schedule
                })
            } catch (err: any) {
                if (err.code === "P2002") {
                    console.log(
                        `Duplicate schedule for doctor ${schedule.doctorId} and schedule ${schedule.scheduleId} ignored.`
                    );
                }
                throw new AppError(500, 'Duplicate schedule for doctor.');
            }
        })
    )

    return 

}


// Delete a schedule
// const deleteSchedule = async(scheduleId: string) => {
//     const schedule = await prisma.schedule.findUnique({
//         where: {
//             id: scheduleId
//         }
//     })

//     if(!schedule){
//         throw new AppError(404, 'Schedule not found')
//     }

//     const result = prisma.schedule.delete({
//         where: {
//             id: scheduleId
//         }
//     }) 

//     return result
// }

export const DoctorScheduleServices = {
    createDoctorSchedules,
    getLogedInDoctorSchedules
}