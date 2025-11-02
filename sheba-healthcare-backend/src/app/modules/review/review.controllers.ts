import { Request, Response } from "express";
import { catchAsync } from "../../errorHelpers/catchAsync";
import { JWTPayload } from "../../interfaces";
import { ReviewServices } from './review.services';
import { sendResponse } from "../../utils/userResponse";
import { StatusCodes } from "http-status-codes";

const createReview = catchAsync(async (req: Request & { user?: JWTPayload }, res: Response) => {
    const user = req.user;
    const result = await ReviewServices.createReview(user as JWTPayload, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Review created successfully',
        data: result,
    });
});

export const ReviewControllers = {
    createReview
}