import mongoose, { isValidObjectId } from "mongoose"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {
    addTweet, findAllTweetForOwner, updateTweetDetails,
    deleteTweetById
} from "../repositories/tweet.repository.js"

const createTweet = asyncHandler(async (req, res) => {
    try {
        const { content } = req.body
        if (!content) {
            throw new ApiError(400, "Invalid input(s)")
        }
        const addTweetResult = await addTweet(content, req.user._id)
        return res.status(200).json(
            new ApiResponse(200, {
                addTweetResult
            }, "Tweet has been created Successfully")
        )
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }
})

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!userId) {
        throw new ApiError(400, "Invalid input(s)")
    }

    const allTweets = await findAllTweetForOwner(userId)
    if (allTweets?.length > 0) {

        return res.status(200).json(
            new ApiResponse(200, {
                allTweets
            }, "Tweet details has been fetched Successfully")
        )
    } else {
        throw new ApiError(400, "No Tweet Found!")
    }
})

const updateTweet = asyncHandler(async (req, res) => {
    try {
        //TODO: update tweet
        const { tweetId } = req.params
        const { content } = req.body
        if (!content) {
            throw new ApiError(400, "Invalid input(s)")
        }
        if (!tweetId) {
            throw new ApiError(400, "Invalid input(s)")
        }

        const updateTweetDetailsResult = await updateTweetDetails(tweetId, {
            content
        })

        return res.status(200).json(
            new ApiResponse(200, {
                updateTweetDetailsResult
            }, "Tweet details has been updated Successfully")
        )
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }
})

const deleteTweet = asyncHandler(async (req, res) => {
    try {
        const { tweetId } = req.params
        const tweet = await deleteTweetById(tweetId)
        if (!tweet) {
            throw new ApiError(404, "Tweet not found")
        }
        return res.status(200).json(
            new ApiResponse(200, {
                tweet
            }, "Tweet has been deleted Successfully")
        )
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}