import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uplodOnCloudinary } from "../utils/cloudinary.js"
import { checkUserExist, createUser, findUserById } from "../repositories/user.repository.js"
import { plainToInstance } from "class-transformer"
import { ReqUser } from "../models/requests/req_user.js"

const registerUser = asyncHandler(async (req, res) => {

    const reqUser = plainToInstance(ReqUser, req.body)

    console.log("reqUser Class : ", reqUser);
    const result = reqUser.isValidForRegister()
    console.log("reqUser result : ", result.isValid);
    console.log("reqUser result : ", result.message);
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

export { registerUser }