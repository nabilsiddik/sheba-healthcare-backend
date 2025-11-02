import { AppointmentStatus, PaymentStatus, Prescription, UserRole } from "@prisma/client";
import { JWTPayload } from "../../interfaces";
import { prisma } from "../../config/db.config";
import AppError from "../../errorHelpers/appError";
import { StatusCodes } from "http-status-codes";


const createPrescription = async (user: JWTPayload, payload: Partial<Prescription>) => {
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
            status: AppointmentStatus.COMPLETED,
            paymentStatus: PaymentStatus.PAID
        },
        include: {
            doctor: true
        }
    })

    if (user.role === UserRole.DOCTOR) {
        if (!(user.email === appointmentData.doctor.email))
            throw new AppError(StatusCodes.BAD_REQUEST, "This is not your appointment")
    }

    const result = await prisma.prescription.create({
        data: {
            appointmentId: appointmentData.id,
            doctorId: appointmentData.doctorId,
            patientId: appointmentData.patientId,
            instractions: payload.instractions as string,
            followUpDate: payload.followUpDate as Date || null
        },
        include: {
            patient: true
        }
    });

    return result;
}

// get my prescription as a patient
export const PrescriptionServices = {
    createPrescription
}