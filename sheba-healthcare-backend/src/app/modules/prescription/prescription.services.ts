import { AppointmentStatus, PaymentStatus, Prescription, UserRole } from "@prisma/client";
import { JWTPayload } from "../../interfaces";
import { prisma } from "../../config/db.config";
import AppError from "../../errorHelpers/appError";
import { StatusCodes } from "http-status-codes";
import calculatePagination, { IOptions } from "../../utils/pagination";

// Craete prescription
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

// Get patient prescription with pagination
const patientPrescription = async (user: JWTPayload, options: IOptions) => {
    const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);

    const result = await prisma.prescription.findMany({
        where: {
            patient: {
                email: user.email
            }
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            doctor: true,
            patient: true,
            appointment: true
        }
    })

    const total = await prisma.prescription.count({
        where: {
            patient: {
                email: user.email
            }
        }
    })

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }

}


// get my prescription as a patient
export const PrescriptionServices = {
    createPrescription,
    patientPrescription
}