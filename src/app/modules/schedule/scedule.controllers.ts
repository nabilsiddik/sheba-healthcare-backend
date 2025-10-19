
import { Request, Response } from 'express';
import { catchAsync } from './../../errorHelpers/catchAsync';
import { ScheduleServices } from './scedule.services';
import { sendResponse } from '../../utils/userResponse';
import { pickQueries } from '../../utils/pickQueries';
import { scheduleFilterableFields } from './schedule.constants';


// Get all schedules for doctor
const getAllSchedulesForDoctor = catchAsync(async (req: Request, res: Response) => {

    const filters = pickQueries(req.query, scheduleFilterableFields)
    const options = pickQueries(req.query, ['page', 'limit', 'sortBy', 'sortOrder'])

    const result = await ScheduleServices.getAllSchedulesForDoctor(filters, options)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'All Schedules Successfully',
        data: {
            meta: result.meta,
            data: result.data
        }
    })
})

// Create schedule
const createSchedule = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleServices.createSchedule(req.body)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Schedule created Successfully',
        data: result
    })
})




// Get all schedules for doctor
const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
    const scheduleId = req.params.id
    const result = await ScheduleServices.deleteSchedule(scheduleId as string)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Schedule deleted successfully.',
        data: result
    })
})


export const ScheduleControllers = {
    createSchedule,
    getAllSchedulesForDoctor,
    deleteSchedule
}