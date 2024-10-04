import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {
    checkVideoLike, addLike, deleteVideoLike,
    checkCommentLike, deleteCommentLike, checkTweetLike,
    deleteTweetLike, getLikedVideo
} from "../repositories/like.repository.js"
import { findVideoById } from "../repositories/video.repository.js"
import { findTweetById } from "../repositories/tweet.repository.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params
        const user = req.user
        if (!videoId) {
            throw new ApiError(400, "Invalid input(s)")
        }

        const video = await findVideoById(videoId)
        if (!video) {
            throw new ApiError(404, "Video not found")
        }

        const videoLikeAvl = await checkVideoLike(user._id, videoId)
        console.log("toggleVideoLike videoLikeAvl : ", videoLikeAvl);

        if (videoLikeAvl) {
            const deleteResult = await deleteVideoLike(user._id, videoId)
            console.log("toggleVideoLike deleteResult : ", deleteResult);
            return res.status(200).json(
                new ApiResponse(200,
                    { deleteResult },
                    "Video has been unliked successfully")
            )
        }
        else {
            const createVideoLike = await addLike({
                likedBy: user._id,
                video: videoId

            })
            console.log("toggleVideoLike createVideoLike : ", createVideoLike);
            return res.status(200).json(
                new ApiResponse(200,
                    { createVideoLike },
                    "Video has been liked successfully")
            )
        }
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    try {
        const { commentId } = req.params
        const user = req.user
        if (!commentId) {
            throw new ApiError(400, "Invalid input(s)")
        }

        const commnetLikeAvl = await checkCommentLike(user._id, commentId)
        console.log("toggleCommentLike commnetLikeAvl : ", commnetLikeAvl);

        if (commnetLikeAvl) {
            const deleteResult = await deleteCommentLike(user._id, commentId)
            console.log("toggleCommentLike deleteResult : ", deleteResult);
            return res.status(200).json(
                new ApiResponse(200,
                    { deleteResult },
                    "Comment has been unliked successfully")
            )
        }
        else {
            const createCommentLike = await addLike({
                likedBy: user._id,
                comment: commentId

            })
            console.log("toggleCommentLike createCommentLike : ", createCommentLike);
            return res.status(200).json(
                new ApiResponse(200,
                    { createCommentLike },
                    "Comment has been liked successfully")
            )
        }
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    try {
        const { tweetId } = req.params
        const user = req.user
        if (!tweetId) {
            throw new ApiError(400, "Invalid input(s)")
        }

        const tweet = await findTweetById(tweetId)
        if (!tweet) {
            throw new ApiError(404, "Tweet not found")
        }

        const tweetLikeAvl = await checkTweetLike(user._id, tweetId)
        console.log("toggleTweetLike tweetLikeAvl : ", tweetLikeAvl);

        if (tweetLikeAvl) {
            const deleteResult = await deleteTweetLike(user._id, tweetId)
            console.log("toggleTweetLike deleteResult : ", deleteResult);
            return res.status(200).json(
                new ApiResponse(200,
                    { deleteResult },
                    "Tweet has been unliked successfully")
            )
        }
        else {
            const createTweetLike = await addLike({
                likedBy: user._id,
                tweet: tweetId

            })
            console.log("toggleTweetLike createTweetLike : ", createTweetLike);
            return res.status(200).json(
                new ApiResponse(200,
                    { createTweetLike },
                    "Tweet has been liked successfully")
            )
        }
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    try {
        const user = req.user
        const likedVideos = await getLikedVideo(user)
        return res.status(200).json(
            new ApiResponse(200,
                { likedVideos },
                "Fetched liked video(s) successfully")
        )
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}