import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uplodOnCloudinary } from "../utils/cloudinary.js"
import { checkUserExist, createUser, findUserById } from "../repositories/user.repository.js"

const registerUser = asyncHandler(async (req, res) => {

    const { username, email, fullName, password } = req.body
    // console.log("EMAIl : ", email);
    // console.log("Files : ", req.files);


    if (
        [username, email, fullName, password].some((field) => field?.trim() === ""
        )) {
        throw new ApiError(400, "All fields are required")
    }



    const currentUser = await checkUserExist(username, email)

    if (currentUser) {
        throw new ApiError(409, "User already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path

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



    const user = await createUser(fullName, uploadAvatar.url,
        uploadcoverImage?.url || "", email, password, username.toLowerCase())

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