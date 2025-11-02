import { Request, Response } from "express";
import { catchAsync } from "../../errorHelpers/catchAsync";
import { JWTPayload } from "../../interfaces";
import { PrescriptionServices } from "./prescription.services";
import { sendResponse } from "../../utils/userResponse";

const createPrescription = catchAsync(async (req: Request & { user?: JWTPayload }, res: Response) => {
    const user = req.user;
    const result = await PrescriptionServices.createPrescription(user as JWTPayload, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "prescription created successfully!",
        data: result
    })
})

export const PrescriptionControllers = {
    createPrescription
}