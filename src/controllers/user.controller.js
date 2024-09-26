import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uplodOnCloudinary } from "../utils/cloudinary.js"
import {
    checkUserExist, createUser, findUserById,
    updateUserDetails, findUserByIdWithAll, findUserByIdWithExclusion
} from "../repositories/user.repository.js"
import { plainToInstance } from "class-transformer"
import { ReqUser } from "../models/requests/req_user.js"
import { ERROR_MSG_SOMETHING_WENT_WRONG } from "../constants.js"
import { User } from "../db/models/user.model.js"
import jwt from "jsonwebtoken"

const generateAccessRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(400, ERROR_MSG_SOMETHING_WENT_WRONG)
    }
}

const registerUser = asyncHandler(async (req, res) => {

    const reqUser = plainToInstance(ReqUser, req.body)

    const result = reqUser.isValidForRegister()

    if (!result.isValid) {
        throw new ApiError(400, result.message)
    }

    const currentUser = await checkUserExist(reqUser.username, reqUser.email)

    if (currentUser) {
        throw new ApiError(409, "User already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path

    let coverImageLocalPath;
    if (req.files &&
        Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    console.log("avatarLocalPath : ", avatarLocalPath);
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const uploadAvatar = await uplodOnCloudinary(avatarLocalPath)

    const uploadcoverImage = await uplodOnCloudinary(coverImageLocalPath)

    if (!uploadAvatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await createUser(reqUser.fullName, uploadAvatar.url,
        uploadcoverImage?.url || "", reqUser.email, reqUser.password, reqUser.username.toLowerCase())

    console.log("user : ", user);

    const findUser = await findUserById(user._id)

    if (!findUser) {
        throw new ApiError(500, "Something went wrong for user add")
    }

    res.status(201).json(
        new ApiResponse(201, findUser, "User Created Successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    const reqUser = plainToInstance(ReqUser, req.body)
    console.log("loginUser reqUser : ", reqUser);


    const result = reqUser.isValidForLogin()

    if (!result.isValid) {
        throw new ApiError(400, result.message)
    }

    const currentUser = await checkUserExist(reqUser.username, reqUser.email)
    console.log("loginUser currentUser : ", currentUser);
    if (!currentUser) {
        throw new ApiError(404, "User not found")
    }

    const isPasswordCorrect = await currentUser.isPasswordCorrect(reqUser.password)
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid user credential")
    }
    const { accessToken, refreshToken } = await generateAccessRefreshToken(currentUser._id)

    const loggedInUser = await findUserByIdWithExclusion(currentUser._id,
        "-password -refreshToken -watchHistory -__v")


    res.status(200).json(
        new ApiResponse(200, {
            user: loggedInUser,
            accessToken,
            refreshToken,
        }, "Logged-in Successfully")
    )

})

const logoutUser = asyncHandler(async (req, res) => {
    const user = req.user

    const updatedUser = await updateUserDetails(user._id, {
        refreshToken: null
    })
    console.log("logoutUser : updatedUser : ", updatedUser);

    res.status(200).json(
        new ApiResponse(200, user.fullName, "Logged-out Successfully")
    )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const refreshTokenIn = req.body.refreshToken

        if (!refreshTokenIn) {
            throw new ApiError(401, "Invalid user credential")
        }
        console.log("refreshAccessToken refreshTokenIn : ", refreshTokenIn);


        const decodedToken = jwt.verify(refreshTokenIn, process.env.REFRESH_TOKEN_SECRET, {
            ignoreExpiration: false
        })
        console.log("refreshAccessToken decodedToken : ", decodedToken);

        const user = await findUserByIdWithAll(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid user credential")
        }

        console.log("refreshAccessToken refreshTokenIn : ", refreshTokenIn);
        console.log("refreshAccessToken user refreshToken : ", user.refreshToken);

        if (refreshTokenIn !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is not valid")
        }
        const { accessToken, refreshToken } = await generateAccessRefreshToken(user._id)

        res.status(200).json(
            new ApiResponse(200, {
                accessToken,
                refreshToken
            }, "Token Refreshed")
        )
    } catch (error) {
        throw new ApiError(401, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }
})

const changePassword = asyncHandler(async (req, res) => {
    const reqBody = plainToInstance(ReqUser, req.body)
    console.log("changePassword reqBody : ", reqBody);


    const result = reqBody.isValidForChangePassword()

    if (!result.isValid) {
        throw new ApiError(400, result.message)
    }

    const currentUser = await findUserByIdWithExclusion(req.user._id)
    console.log("changePassword currentUser : ", currentUser);

    if (!currentUser) {
        throw new ApiError(404, "User not found")
    }

    const isPasswordCorrect = await currentUser.isPasswordCorrect(reqBody.currentPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid user credential")
    }

    currentUser.password = reqBody.newPassword
    await currentUser.save({ validateBeforeSave: false })

    res.status(200).json(
        new ApiResponse(200, {
            newPassword: reqBody.newPassword,
        }, "Password has been updated Successfully")
    )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, {
            userData: req.user,
        }, "User details fetched Successfully")
    )
})

const updateDetails = asyncHandler(async (req, res) => {
    const reqBody = plainToInstance(ReqUser, req.body)
    console.log("changePassword reqBody : ", reqBody);


    const result = reqBody.isValidForUpdateDetails()

    if (!result.isValid) {
        throw new ApiError(400, result.message)
    }

    const updatedUser = await updateUserDetails(req.user._id, {
        fullName: reqBody.fullName
    }, "-password -watchHistory -__v -refreshToken")
    console.log("updateDetails updatedUser : ", updatedUser);

    if (!updatedUser) {
        throw new ApiError(404, "User not found")
    }

    res.status(200).json(
        new ApiResponse(200, {
            updatedUser,
        }, "User details has been updated Successfully")
    )
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalImage = req.file?.path
    if (!avatarLocalImage) {
        throw new ApiError(400, "Image not found")
    }
    const avatar = await uplodOnCloudinary(avatarLocalImage)
    if (!avatar.url) {
        throw new ApiError(500, "Error while uploading image")
    }


    const updatedUser = await updateUserDetails(req.user._id, {
        avatar: avatar.url
    }, "-password -watchHistory -__v -refreshToken")
    console.log("updateUserAvatar updatedUser : ", updatedUser);

    if (!updatedUser) {
        throw new ApiError(404, "User not found")
    }

    res.status(200).json(
        new ApiResponse(200, {
            updatedUser,
        }, "User details has been updated Successfully")
    )
})

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverLocalImage = req.file?.path

    if (!coverLocalImage) {
        throw new ApiError(400, "Image not found")
    }
    const coverImage = await uplodOnCloudinary(coverLocalImage)
    if (!coverImage.url) {
        throw new ApiError(500, "Error while uploading image")
    }


    const updatedUser = await updateUserDetails(req.user._id, {
        coverImage: coverImage.url
    }, "-password -watchHistory -__v -refreshToken")
    console.log("updateUserCoverImage updatedUser : ", updatedUser);

    if (!updatedUser) {
        throw new ApiError(404, "User not found")
    }

    res.status(200).json(
        new ApiResponse(200, {
            updatedUser,
        }, "User details has been updated Successfully")
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    getCurrentUser,
    updateDetails,
    updateUserAvatar,
    updateUserCoverImage
}