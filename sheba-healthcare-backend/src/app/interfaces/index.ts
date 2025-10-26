import { Request } from "express";

export interface JWTPayload {
    email: string,
    role: string
}

export interface IAuthenticatedRequest extends Request{
    user: JWTPayload
}