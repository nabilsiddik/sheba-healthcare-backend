import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

// Validate request according to the zod schema
const validateRequest = (zodSchema: ZodObject) => async(req: Request, res: Response, next: NextFunction) => {
  try{
    await zodSchema.parseAsync({
      body: req.body
    })
    return next()
  }catch(err: unknown){
    next(err)
  }
}

export default validateRequest