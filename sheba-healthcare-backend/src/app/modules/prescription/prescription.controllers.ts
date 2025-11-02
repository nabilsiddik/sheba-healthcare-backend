import { Request, Response } from "express";
import { catchAsync } from "../../errorHelpers/catchAsync";
import { JWTPayload } from "../../interfaces";
import { PrescriptionServices } from "./prescription.services";
import { sendResponse } from "../../utils/userResponse";
import { pickQueries } from "../../utils/pickQueries";
import { StatusCodes } from "http-status-codes";

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

const patientPrescription = catchAsync(async (req: Request & { user?: JWTPayload }, res: Response) => {
    const user = req.user;
    const options = pickQueries(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
    const result = await PrescriptionServices.patientPrescription(user as JWTPayload, options);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Prescription fetched successfully',
        meta: result.meta,
        data: result.data
    });
});

export const PrescriptionControllers = {
    createPrescription,
    patientPrescription
    
}