import nodemailer from 'nodemailer'
import { envVars } from '../../config/env';

const emailSender = async (
    email: string,
    html: string
) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: envVars.EMAIL_SENDER_EMAIL,
            pass: envVars.EMAIL_SENDER_APP_PASSWORD, // app password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const info = await transporter.sendMail({
        from: '"Sheba Health Care" <nabilsiddik90@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Reset Your Password", // Subject line
        //text: "Hello world?", // plain text body
        html, // html body
    });

}

export default emailSender;