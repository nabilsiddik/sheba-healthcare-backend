import { Request, Response } from "express";
import { catchAsync } from "../../errorHelpers/catchAsync";
import { stripe } from "../../config/stripe.config";
import { sendResponse } from "../../utils/userResponse";
import { PaymentServices } from "./payment.services";
import { envVars } from "../../config/env";

const handleStripeWebhookEvent = catchAsync(async (req: Request, res: Response) => {

    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = envVars.WEBHOOK_SIGNING_SECRET

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    const result = await PaymentServices.handleStripeWebhookEvent(event);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Webhook req send successfully',
        data: result,
    });
});

export const PaymentControllers = {
    handleStripeWebhookEvent
}