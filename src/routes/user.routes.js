import { Router } from "express";
import {
    registerUser, loginUser, logoutUser,
    refreshAccessToken, changePassword,
    getCurrentUser, updateDetails, updateUserAvatar,
    updateUserCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { API_VERSION } from "../constants.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"

const USER_ROUTE = `${API_VERSION}/users`
const USER_REGISTER_ROUTE = "/register"
const USER_LOGIN_ROUTE = "/login"
const USER_LOGOUT_ROUTE = "/logout"
const REFRESH_ACCESS_TOKEN_ROUTE = "/refreshAccessToken"
const CHANGE_PASS_ROUTE = "/changePassword"
const CURRENT_USER_ROUTE = "/getCurrentUser"
const UPDATE_USER_DETAILS_ROUTE = "/updateUserDetails"
const UPDATE_USER_AVATAR_ROUTE = "/updateUserAvatar"
const UPDATE_USER_COVER_ROUTE = "/updateUserCover"

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

userRouter.route(USER_LOGIN_ROUTE).post(loginUser)

userRouter.route(USER_LOGOUT_ROUTE).get(verifyJwt, logoutUser)

userRouter.route(REFRESH_ACCESS_TOKEN_ROUTE).post(verifyJwt, refreshAccessToken)

userRouter.route(CHANGE_PASS_ROUTE).post(verifyJwt, changePassword)

userRouter.route(CURRENT_USER_ROUTE).get(verifyJwt, getCurrentUser)

userRouter.route(UPDATE_USER_DETAILS_ROUTE).post(verifyJwt, updateDetails)

userRouter.route(UPDATE_USER_AVATAR_ROUTE).post(verifyJwt, upload.single("avatar"), updateUserAvatar)

userRouter.route(UPDATE_USER_COVER_ROUTE).post(verifyJwt, upload.single("coverImage"), updateUserCoverImage)


export { userRouter, USER_ROUTE }