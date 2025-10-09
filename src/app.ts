import express, { Request, Response } from 'express'
import { router } from './app/routes'
import cors from 'cors'
import { enVars } from './app/config/env'
import cookieParser from 'cookie-parser'

export const app = express()

app.use(express.json())
app.use(cors({
    origin: [enVars.LOCALHOST_CLIENT_URL, enVars.DEPLOYED_CLIENT_URL],
    credentials: true
}))
app.use(cookieParser())

app.use('/api/v1', router)

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: `Server is running on port ${enVars.PORT}`
    })
})