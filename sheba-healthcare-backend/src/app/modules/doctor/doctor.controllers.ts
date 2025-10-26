import { Request, Response } from "express";
import { catchAsync } from "../../errorHelpers/catchAsync";
import { pickQueries } from "../../utils/pickQueries";
import { doctorFilterableFields } from "./doctor.constants";
import { DoctorServices } from "./doctor.services";
import { sendResponse } from "../../utils/userResponse";


const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
    const options = pickQueries(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const fillters = pickQueries(req.query, doctorFilterableFields)

    const result = await DoctorServices.getAllDoctors(fillters, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor fetched successfully!",
        meta: result.meta,
        data: result.data
    })
})

const updateDoctor = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;

    const result = await DoctorServices.updateDoctor(id, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor updated successfully!",
        data: result
    })
})

// Get doctor by id
const getDoctorById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await DoctorServices.getDoctorById(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Doctor retrieval successfully',
        data: result,
    });
});


// Get AI Suggessions
const getAISuggessions = catchAsync(async (req: Request, res: Response) => {

    const result = await DoctorServices.getAISuggessions(req.body)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "AI suggession fetched successfully",
        data: result
    })
})


export const DoctorControllers = {
    getAllDoctors,
    updateDoctor,
    getAISuggessions,
    getDoctorById
}