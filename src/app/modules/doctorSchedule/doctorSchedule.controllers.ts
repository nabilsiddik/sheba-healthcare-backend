import { Request, Response } from "express"
import { catchAsync } from "../../errorHelpers/catchAsync"
import { sendResponse } from "../../utils/userResponse"
import { DoctorScheduleServices } from "./doctorSchedule.services"

// Get Loged in doctor schedules
const getLogedInDoctorSchedules = catchAsync(async (req: Request & {user?: any}, res: Response) => {

    const user = req.user
    const result = await DoctorScheduleServices.getLogedInDoctorSchedules(user)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Loged In Doctors schedule retrived successfully',
        data: result
    })
})

// Create schedule
const createDoctorSchedule = catchAsync(async (req: Request & {user?: any}, res: Response) => {

    const user = req.user

    const result = await DoctorScheduleServices.createDoctorSchedules(req.body, user)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Doctor schedule created successfully',
        data: result
    })
})

export const DoctorScheduleControllers = {
    createDoctorSchedule,
    getLogedInDoctorSchedules
}

