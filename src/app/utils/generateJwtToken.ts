import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { JWTPayload } from "../interfaces";

export const generateJwtToken = (payload: JWTPayload, secret: Secret, expiresIn: SignOptions["expiresIn"]): string => {
    const options: SignOptions = {
        algorithm: 'HS256', 
        expiresIn
    }
    const token = jwt.sign(
        payload,
        secret,
        options
    )

    return token
}