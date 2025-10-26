import express, { Request, Response } from 'express'
import { router } from './app/routes'
import cors from 'cors'
import { envVars } from './app/config/env'
import cookieParser from 'cookie-parser'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import { PaymentControllers } from './app/modules/payment/payment.controllers'

export const app = express()

app.post('/webhook', 
    express.raw({type: 'application/json'}),
    PaymentControllers.handleStripeWebhookEvent
)

app.use(cors({
    origin: [],
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())


app.use('/api/v1', router)

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: `Server is running on port ${envVars.PORT}`
    })
})

app.use(globalErrorHandler)