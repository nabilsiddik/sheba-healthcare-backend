import express from 'express';
import { UserRole } from '@prisma/client';
import { PatientControllers } from './patient.controllers';
import { checkAuth } from '../../middlewares/checkAuth';

const patientRouter = express.Router();

patientRouter.get(
    '/',
    PatientControllers.getAllFromDB
);

patientRouter.get(
    '/:id',
    PatientControllers.getByIdFromDB
);

patientRouter.patch(
    '/',
    checkAuth(UserRole.PATIENT),
    PatientControllers.updateIntoDB
);

patientRouter.delete(
    '/soft/:id',
    PatientControllers.softDelete
);

export default patientRouter