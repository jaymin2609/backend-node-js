import mongoose, { isValidObjectId } from "mongoose"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {
    findUserById,
} from "../repositories/user.repository.js"
import {
    checkSubsExist, deleteSub, createSub,
    getSubscribedChannelsData, getUserChannelSubscribersData,
} from "../repositories/subscription.repository.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    try {
        const { channelId } = req.params
        const user = req.user

        if (!channelId?.trim()) {
            throw new ApiError(400, "Invalid input(s)")
        }

        const fetchedChannel = await findUserById(channelId)

        if (!fetchedChannel) {
            throw new ApiError(404, "Channel does not exist")
        }

        const subsAvl = await checkSubsExist(user._id, channelId)
        console.log("toggleSubscription subsAvl : ", subsAvl);

        if (subsAvl) {
            const deleteResult = await deleteSub(user._id, channelId)
            console.log("toggleSubscription deleteResult : ", deleteResult);
            return res.status(200).json(
                new ApiResponse(200,
                    { deleteResult },
                    "Channel has been unsubscribed successfully")
            )
        }
        else {
            const createSubResult = await createSub(user._id, channelId)
            console.log("toggleSubscription createSubResult : ", createSubResult);
            return res.status(200).json(
                new ApiResponse(200,
                    { createSubResult },
                    "Channel has been subscribed successfully")
            )
        }

    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    try {
        const { channelId } = req.params

        if (!channelId?.trim()) {
            throw new ApiError(400, "Invalid input(s)")
        }

        const fetchedChannel = await findUserById(channelId)

        if (!fetchedChannel) {
            throw new ApiError(404, "Channel does not exist")
        }

        const subscribers = await getUserChannelSubscribersData(channelId)
        console.log("getUserChannelSubscribers subscribers : ", subscribers);


        if (!subscribers?.length) {
            throw new ApiError(400, "No data found")
        }
        return res.status(200).json(
            new ApiResponse(200,
                { subscribers },
                "Subscribers data found successfully")
        )
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    try {
        const { subscriberId } = req.params

        if (!subscriberId?.trim()) {
            throw new ApiError(400, "Invalid input(s)")
        }

        const channels = await getSubscribedChannelsData(subscriberId)
        console.log("getSubscribedChannels channels : ", channels);


        if (!channels?.length) {
            throw new ApiError(400, "No data found")
        }
        return res.status(200).json(
            new ApiResponse(200,
                { channels },
                "Subscribed Channel data found successfully")
        )
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}