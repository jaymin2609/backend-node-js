import { Like } from "../db/models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import mongoose, { Schema } from "mongoose"


const addLike = async (inputObject) => {
    try {
        const createResult = await Like.create(inputObject)
        return createResult
    } catch (error) {
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

const checkVideoLike = async (likedBy, video) => {
    try {
        const sub = await Like.findOne({
            $and: [{ likedBy }, { video }]
        })
        return sub
    } catch (error) {
        console.log("checkVideoLike ERROR : ", error);
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

const deleteVideoLike = async (likedBy, video) => {
    try {
        const deleteResult = await Like.deleteOne({
            $and: [{ likedBy }, { video }]
        })
        return deleteResult
    } catch (error) {
        console.log("deleteVideoLike ERROR : ", error);
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

const checkCommentLike = async (likedBy, comment) => {
    try {
        const sub = await Like.findOne({
            $and: [{ likedBy }, { comment }]
        })
        return sub
    } catch (error) {
        console.log("checkCommentLike ERROR : ", error);
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

const deleteCommentLike = async (likedBy, comment) => {
    try {
        const deleteResult = await Like.deleteOne({
            $and: [{ likedBy }, { comment }]
        })
        return deleteResult
    } catch (error) {
        console.log("deleteCommentLike ERROR : ", error);
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

const checkTweetLike = async (likedBy, tweet) => {
    try {
        const sub = await Like.findOne({
            $and: [{ likedBy }, { tweet }]
        })
        return sub
    } catch (error) {
        console.log("checkTweetLike ERROR : ", error);
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

const deleteTweetLike = async (likedBy, tweet) => {
    try {
        const deleteResult = await Like.deleteOne({
            $and: [{ likedBy }, { tweet }]
        })
        return deleteResult
    } catch (error) {
        console.log("deleteTweetLike ERROR : ", error);
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

const getLikedVideo = async (user) => {
    try {
        const videos = await Like.aggregate([
            {
                $match: {
                    likedBy: new mongoose.Types.ObjectId(user._id),
                    $and: [{ video: { $exists: true } }],
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "video",
                    foreignField: "_id",
                    as: "video",
                    pipeline: [
                        {
                            $project: {
                                videoFile: 1,
                                thumbnail: 1,
                                title: 1,
                                description: 1,
                                duration: 1,
                            }
                        },
                    ]
                }
            },
            {
                $addFields: {
                    video: {
                        $first: "$video"
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    video: 1,
                    likedBy: 1,
                    createdAt: 1,
                    updatedAt: 1,
                }
            }
        ])

        console.log("getLikedVideo videos : ", videos);
        if (!videos?.length) {
            throw new ApiError(404, "Liked video(s) does not exist")
        }
        return videos

    } catch (error) {
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

export {
    checkVideoLike,
    addLike,
    deleteVideoLike,
    checkCommentLike,
    deleteCommentLike,
    checkTweetLike,
    deleteTweetLike,
    getLikedVideo,
}