import { Request, Response } from "express"
import { catchAsync } from "../../errorHelpers/catchAsync"
import { AppointmentServices } from "./appointment.services"
import { sendResponse } from "../../utils/userResponse"
import { IAuthenticatedRequest, JWTPayload } from "../../interfaces"

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

export const AppointmentControllers = {
    bookAppointment
}
