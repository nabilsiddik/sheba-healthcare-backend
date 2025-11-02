
import { Request, Response } from 'express';
import { catchAsync } from './../../errorHelpers/catchAsync';
import { sendResponse } from '../../utils/userResponse';
import { UserServices } from './user.services';
import { pickQueries } from './../../utils/pickQueries';
import { userFilterableFields, userSearchableFields } from './user.constants';
import { JWTPayload } from '../../interfaces';
import { StatusCodes } from 'http-status-codes';


// Get all users from db
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters =  pickQueries(req.query, userFilterableFields)
  const options =  pickQueries(req.query, ['page', 'limit', 'sortBy', 'sortOrder'])

  const result = await UserServices.getAllUsers(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All users retrived successfully.',
    data: result
  })
})

// Get user profile info
const getMyProfile = catchAsync(async (req: Request & { user?: JWTPayload }, res: Response) => {

    const user = req.user;

    const result = await UserServices.getMyProfile(user as JWTPayload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "My profile data fetched!",
        data: result
    })
});


// Create patient
const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createPatient(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Patient Account Created Successfully',
    data: result
  })
})

// Create admin
const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createAdmin(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Admin Account Created Successfully',
    data: result
  })
})


// Create doctor
const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createDoctor(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Doctor Account Created Successfully',
    data: result
  })
})


// Update user profile status
const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;
    const result = await UserServices.changeProfileStatus(id, req.body)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Users profile status changed!",
        data: result
    })
});



export const UserControllers = {
  getAllUsers,
  createPatient,
  createAdmin,
  createDoctor,
  getMyProfile,
  changeProfileStatus
}