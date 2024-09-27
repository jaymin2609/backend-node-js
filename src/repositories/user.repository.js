import { User } from "../db/models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import mongoose, { Schema } from "mongoose"

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

const findUserByIdWithExclusion = async (id, excludeFields) => {
    try {
        return await User.findById(id)
            .select(
                excludeFields
            )
    } catch (error) {
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

const findUserByIdWithAll = async (id) => {
    try {
        return await User.findById(id)

    } catch (error) {
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

const updateUserDetails = async (id, updatedFields, excludeFields) => {
    try {
        console.log("updateUserDetails updatedFields : ", updatedFields);
        return await User.findByIdAndUpdate(id,
            updatedFields,
            {
                new: true
            }).select(excludeFields)
    } catch (error) {
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

const getUserChannelProfileData = async (user, username) => {
    try {
        const channel = await User.aggregate([
            {
                $match: {
                    username: username?.toLowerCase()
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "channel",
                    as: "subscribers"
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "subscriber",
                    as: "subscribedTo"
                }
            },
            {
                $addFields: {
                    subscribersCount: {
                        $size: "$subscribers"
                    },
                    subscribedToCount: {
                        $size: "$subscribedTo"
                    },
                    isSubscribed: {
                        $cond: {
                            if: { $in: [user?._id, "$subscribers.subscriber"] },
                            then: true,
                            else: false

                        }
                    }
                }
            },
            {
                $project: {
                    fullName: 1,
                    username: 1,
                    subscribersCount: 1,
                    subscribedToCount: 1,
                    isSubscribed: 1,
                    avatar: 1,
                    coverImage: 1,
                    email: 1
                }
            }
        ])

        console.log("getUserChannelProfile channel : ", channel);
        if (!channel?.length) {
            throw new ApiError(404, "Channel does not exist")
        }
        return channel

    } catch (error) {
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

const getWatchHistoryData = async (user) => {
    try {
        const channel = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(user._id)
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "watchHistory",
                    foreignField: "_id",
                    as: "watchHistory",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "owner",
                                pipeline: [
                                    {
                                        $project: {
                                            fullName: 1,
                                            email: 1,
                                            username: 1,
                                            avatar: 1,
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $addFields: {
                                owner: {
                                    $first: "$owner"
                                }
                            }
                        }
                    ]
                }
            },

        ])

        console.log("getUserChannelProfile channel : ", channel);
        if (!channel?.length) {
            throw new ApiError(404, "Channel does not exist")
        }
        return channel

    } catch (error) {
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

export {
    checkUserExist,
    createUser,
    findUserById,
    updateUserDetails,
    findUserByIdWithAll,
    findUserByIdWithExclusion,
    getUserChannelProfileData,
    getWatchHistoryData,
}