// import { NextFunction, Request, Response } from "express";
// import jwt from "jsonwebtoken";
// import { JwtPayload } from "jsonwebtoken";
// import AppError from "../errorHelpers/appError";
// import { enVars } from "../config/env";

// export const checkAuth =
//   (...authRoles: string[]) =>
//     async (req: Request, res: Response, next: NextFunction) => {
//       try {
//         const accessToken = req.headers.authorization || req.cookies.accessToken

//         // Throw error if access token not found
//         if (!accessToken) {
//           throw new AppError(403, "Access Token not found");
//         }

//         const verifiedToken = jwt.verify(
//           accessToken,
//           enVars.JWT_ACCESS_SECRET
//         ) as JwtPayload;

//         const existingUser = await User.findOne({
//           email: verifiedToken.email,
//         });
        

//         // Throw error if not existing user
//         if (!existingUser) {
//           throw new AppError(401, "User does not exist");
//         }

//         // Throw error if user is not verified
//         if (!existingUser.isVerified) {
//           throw new AppError(401, "User is not verified");
//         }

//         // Throw error if user is blocked or inactive
//         if (
//           existingUser.isActive === IsActive.BLOCKED ||
//           existingUser.isActive === IsActive.INACTIVE
//         ) {
//           throw new AppError(
//             400,
//             `User is ${existingUser.isActive}`
//           );
//         }

//         // Throw error if user is deleted
//         if (existingUser.isDeleted) {
//           throw new AppError(400, "User is deleted");
//         }


//         // Throw error if user is not permited to the route
//         if (!authRoles.includes(verifiedToken.role)) {
//           throw new AppError(403, "You are not permited to access this route.");
//         }

//         req.user = verifiedToken

//         next();
//       } catch (error: any) {
//         next(error);
//       }
//     };