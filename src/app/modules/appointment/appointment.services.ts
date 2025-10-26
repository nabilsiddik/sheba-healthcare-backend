import { prisma } from "../../config/db.config";
import { envVars } from "../../config/env";
import { stripe } from "../../config/stripe.config";
import { JWTPayload } from "../../interfaces"
import { uuid } from 'uuidv4'

// book appointment
const bookAppointment = async (user: JWTPayload, payload: { doctorId: string, scheduleId: string }) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId,
            isDeleted: false
        }
    });

    const isBookedOrNot = await prisma.doctorSchedule.findFirstOrThrow({
        where: {
            doctorId: payload.doctorId,
            scheduleId: payload.scheduleId,
            isBooked: false
        }
    })

    const videoCallingId = uuid();

    const result = await prisma.$transaction(async (tnx) => {
        const appointmentData = await tnx.appointment.create({
            data: {
                patientId: patientData.id,
                doctorId: doctorData.id,
                scheduleId: payload.scheduleId,
                videoCallingId
            }
        })

        await tnx.doctorSchedule.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: doctorData.id,
                    scheduleId: payload.scheduleId
                }
            },
            data: {
                isBooked: true
            }
        })

        const transactionId = uuid();

        await tnx.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId
            }
        })


        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `Appointment with Doctor ${doctorData.name}`,
                            description: `Date: `,
                        },
                        unit_amount: doctorData.appointmentFee * 100, // Stripe accepts cents
                    },
                    quantity: 1,
                },
            ],
            success_url: `https://web.programming-hero.com`,
            cancel_url: `https://google.com`,
        });

        console.log(session)

        return appointmentData;
    })


    return result;
}

export const AppointmentServices = {
    bookAppointment
}