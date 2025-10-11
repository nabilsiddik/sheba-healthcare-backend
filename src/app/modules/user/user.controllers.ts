
import { Request, Response } from 'express';
import { catchAsync } from './../../errorHelpers/catchAsync';
import { sendResponse } from '../../utils/userResponse';
import { UserServices } from './user.services';

// Create patient
const createUser = catchAsync(async(req: Request, res: Response)=> {
  const result = await UserServices.createPatient(req);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Patient Created Successfully',
      data: result
    }) 
})


export const UserControllers = {
    createUser
}