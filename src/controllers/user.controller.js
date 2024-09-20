import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { uplodOnCloudinary } from "../utils/cloudinary.js"

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation not empty
    // check user already exist : username, email
    // check for images and avatar
    // upload to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token from response
    // check for user creation
    // return response

    const { username, email, fullName, password } = req.body
    console.log("EMAIl : ", email);

    // if (fullName === "") {
    //     throw new ApiError(400, "full name is required")

    // }
    if (
        [username, email, fullName, password].some((field) => field?.trim() === ""
        )) {
        throw new ApiError(400, "All fields are required")
    }

    const currentUser = User.findOne({
        $or: [{ username }, { email }]
    })
    // console.log("currentUser : ", currentUser);


    if (currentUser) {
        // throw new ApiError(409, "User already exist")
    }

    console.log("Files : ", req.files);


    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    console.log("avatarLocalPath : ", avatarLocalPath);
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const uploadAvatar = await uplodOnCloudinary(avatarLocalPath)
    const uploadcoverImage = await uplodOnCloudinary(coverImageLocalPath)

    if (!uploadAvatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: uploadAvatar.url,
        coverImage: uploadcoverImage.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    console.log("user : ", user);
    const findUser = await User.findById(user._id)
        .select(
            "-password -refreshToken"
        )

    if (!findUser) {
        throw new ApiError(500, "Something went wrong for user add")
    }

    res.status(201).json(new ApiResponse(201, findUser, "User Created Successfully"))
})

export { registerUser }