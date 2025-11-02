import { UserRole } from '@prisma/client';
import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { PrescriptionControllers } from './prescription.controllers';

const prescriptionRouter = express.Router();

prescriptionRouter.post(
    "/",
    checkAuth(UserRole.DOCTOR),
    PrescriptionControllers.createPrescription
);

export default prescriptionRouter