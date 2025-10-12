
import { Request, Response } from 'express';
import { catchAsync } from './../../errorHelpers/catchAsync';
import { sendResponse } from '../../utils/userResponse';
import { UserServices } from './user.services';

// Create patient
const createPatient = catchAsync(async(req: Request, res: Response)=> {
  const result = await UserServices.createPatient(req);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Patient Account Created Successfully',
      data: result
    }) 
})

// Create admin
const createAdmin = catchAsync(async(req: Request, res: Response)=> {
  const result = await UserServices.createAdmin(req);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Admin Account Created Successfully',
      data: result
    }) 
})


// Create doctor
const createDoctor = catchAsync(async(req: Request, res: Response)=> {
  const result = await UserServices.createDoctor(req);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Doctor Account Created Successfully',
      data: result
    }) 
})


export const UserControllers = {
    createPatient,
    createAdmin,
    createDoctor
}