import { Request, Response } from "express"
import { catchAsync } from "../../errorHelpers/catchAsync"
import { AppointmentServices } from "./appointment.services"
import { sendResponse } from "../../utils/userResponse"
import { IAuthenticatedRequest, JWTPayload } from "../../interfaces"
import { pickQueries } from "../../utils/pickQueries"

// Book appointment
const bookAppointment = catchAsync(async (req: Request, res: Response) => {
    const user = (req as IAuthenticatedRequest).user
    const result = await AppointmentServices.bookAppointment(user as JWTPayload, req.body)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Appointment Booked successfully",
        data: result
    })
})

// Get my appointments
const getMyAppointment = catchAsync(async (req: Request & { user?: JWTPayload }, res: Response) => {
    const options = pickQueries(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const fillters = pickQueries(req.query, ["status", "paymentStatus"])
    const user = req.user;
    const result = await AppointmentServices.getMyAppointment(user as JWTPayload, fillters, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Appointment fetched successfully!",
        data: result
    })
})


const updateAppointmentStatus = catchAsync(async (req: Request & { user?: JWTPayload }, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user;

    const result = await AppointmentServices.updateAppointmentStatus(id, status, user as JWTPayload);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Appointment updated successfully!",
        data: result
    })
})

export const AppointmentControllers = {
    bookAppointment,
    getMyAppointment,
    updateAppointmentStatus
}
