import { Request, Response } from 'express';
import { catchAsync } from '../../errorHelpers/catchAsync';
import { pickQueries } from '../../utils/pickQueries';
import { patientFilterableFields } from './patient.constants';
import { PatientServices } from './patient.services';
import { sendResponse } from '../../utils/userResponse';
import { StatusCodes } from 'http-status-codes';
import { JWTPayload } from '../../interfaces';


const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pickQueries(req.query, patientFilterableFields);
    const options = pickQueries(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await PatientServices.getAllFromDB(filters, options);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Patient retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;
    const result = await PatientServices.getByIdFromDB(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Patient retrieval successfully',
        data: result,
    });
});

const softDelete = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PatientServices.softDelete(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Patient soft deleted successfully',
        data: result,
    });
});

const updateIntoDB = catchAsync(async (req: Request & { user?: JWTPayload }, res: Response) => {
    const user = req.user;
    const result = await PatientServices.updateIntoDB(user as JWTPayload, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Patient updated successfully',
        data: result,
    });
});

export const PatientControllers = {
    getAllFromDB,
    getByIdFromDB,
    softDelete,
    updateIntoDB
};