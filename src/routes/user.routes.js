import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { API_VERSION } from "../constants.js"

const USER_ROUTE = `${API_VERSION}/users`
const USER_REGISTER_ROUTE = "/register"
const USER_LOGIN_ROUTE = "/login"

const userRouter = Router()

userRouter.route(USER_REGISTER_ROUTE).post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        }

    ]),
    registerUser
)

export { userRouter, USER_ROUTE }