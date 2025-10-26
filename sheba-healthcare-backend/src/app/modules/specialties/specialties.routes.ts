import express, { NextFunction, Request, Response } from 'express';
import { UserRole } from '@prisma/client';
import { SpecialtiesControllers } from './specialties.controllers';
import { fileUploader } from '../../utils/fileUploder';
import validateRequest from '../../middlewares/validateRequest';
import { SpecialtiesValidtaions } from './specialties.validation';
import { checkAuth } from '../../middlewares/checkAuth';


const specialtiesRouter = express.Router();

specialtiesRouter.get('/', SpecialtiesControllers.getAllSpecialties);

specialtiesRouter.post(
    '/',
    fileUploader.upload.single('file'),
    validateRequest(SpecialtiesValidtaions.createSpecialtiesZodSchema),
    SpecialtiesControllers.createSpecialties
);

specialtiesRouter.delete(
    '/:id',
    checkAuth(UserRole.ADMIN),
    SpecialtiesControllers.deleteSpecialties
);

export default specialtiesRouter