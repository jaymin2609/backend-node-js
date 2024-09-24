import { User } from "../db/models/user.model.js"
import { ApiError } from "../utils/ApiError.js"

const checkUserExist = async (username, email) => {
    try {
        const currentUser = await User.findOne({
            $or: [{ username }, { email }]
        })
        return currentUser
    } catch (error) {
        console.log("checkUserExist ERROR : ", error);
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}


const createUser = async (fullName, avatar, coverImage, email, password, username) => {
    try {
        const user = await User.create({
            fullName,
            avatar: avatar,
            coverImage: coverImage,
            email,
            password,
            username: username.toLowerCase()
        })
        return user
    } catch (error) {
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }

}

const findUserById = async (id) => {
    try {
        return await User.findById(id)
            .select(
                "-password -refreshToken"
            )
    } catch (error) {
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

export { checkUserExist, createUser, findUserById }