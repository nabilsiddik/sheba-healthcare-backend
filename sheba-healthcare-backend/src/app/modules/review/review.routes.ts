import express from 'express'
import { UserRole } from '@prisma/client';
import { checkAuth } from '../../middlewares/checkAuth';
import { ReviewControllers } from './review.controllers';

const reviewRouter = express.Router();

reviewRouter.post(
    '/',
    checkAuth(UserRole.PATIENT),
    ReviewControllers.createReview
);


export default reviewRouter