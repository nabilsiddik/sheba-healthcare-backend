import express, { Request, Response } from 'express'
import { router } from './app/routes'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { envVars } from './app/config/env'

export const app = express()

app.use(express.json())
app.use(cors({
    origin: [],
    credentials: true
}))
app.use(cookieParser())

app.use('/api/v1', router)

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: `Server is running on port ${envVars.PORT}`
    })
})