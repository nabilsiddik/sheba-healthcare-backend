import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err)
    let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    let success = false
    let message = err.message || 'Something went wrong'
    let error = err

    // Handle Prisma Client Known Request Error
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            message = `Duplicate key error`
            error = err.meta
            statusCode = StatusCodes.CONFLICT
        }

        if (err.code === 'P1000') {
            message = 'Authentication failed against database server'
            error = err.meta
            statusCode = StatusCodes.UNAUTHORIZED
        }

        if (err.code === 'P2003') {
            message = 'Foreign key constraint failed on the field'
            error = err.meta
            statusCode = StatusCodes.BAD_REQUEST
        }
    }

    // Handle prisma client unknown request error
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        message = 'Unknown prisma error occured',
        error = err.message
        statusCode = StatusCodes.BAD_REQUEST
    }

    else if (err instanceof Prisma.PrismaClientInitializationError) {
        message = 'Prisma client failed to initialized',
        error = err.message
        statusCode = StatusCodes.BAD_REQUEST
    }

    // Handle prisma client validation error
    else if (err instanceof Prisma.PrismaClientValidationError) {
        message = 'Prisma Validation Error',
        error = err.message
        statusCode = StatusCodes.BAD_REQUEST
    }

    // Handle zod validation error
    else if (err.name === 'ZodError') {
        message = 'Zod Validation Error',
        error = error
        statusCode = StatusCodes.BAD_REQUEST
    }

    res.status(statusCode).json({
        success,
        message,
        error
    })
}

export default globalErrorHandler