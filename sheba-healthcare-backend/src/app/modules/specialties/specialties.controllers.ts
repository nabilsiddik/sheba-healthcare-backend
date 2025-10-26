import { Request, Response } from "express";
import { catchAsync } from "../../errorHelpers/catchAsync";
import { sendResponse } from "../../utils/userResponse";
import { StatusCodes } from "http-status-codes";
import { SpecialtiesServices } from "./specialties.services";

// Create specialties
const createSpecialties = catchAsync(async (req: Request, res: Response) => {
    const result = await SpecialtiesServices.createSpecialties(req);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Specialties created successfully!",
        data: result
    });
});


// Get all special ties
const getAllSpecialties = catchAsync(async (req: Request, res: Response) => {
    const result = await SpecialtiesServices.getAllSpecialties();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Specialties data fetched successfully',
        data: result,
    });
});


// Delete specialties
const deleteSpecialties = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SpecialtiesServices.deleteSpecialties(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Specialty deleted successfully',
        data: result,
    });
});

export const SpecialtiesControllers = {
    createSpecialties,
    getAllSpecialties,
    deleteSpecialties
};