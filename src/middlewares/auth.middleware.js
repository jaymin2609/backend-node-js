import { findUserById } from "../repositories/user.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, res, next) => {

    try {
        const accessToken = req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "")
        console.log("verifyJwt accessToken : ", accessToken);


        if (!accessToken) {
            throw new ApiError(401, "Unathorized token")
        }

        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, {
            ignoreExpiration: false
        })
        console.log("verifyJwt decodedToken : ", decodedToken);
        const user = await findUserById(decodedToken?._id)

        console.log("verifyJwt user : ", user);
        if (!user) {
            throw new ApiError(401, "Invalid Access Token 1")
        }

        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, "Invalid Access Token 2")
    }
})