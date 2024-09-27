import { Subscription } from "../db/models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"

const checkSubsExist = async (subscriber, channel) => {
    try {
        const sub = await Subscription.findOne({
            $and: [{ subscriber }, { channel }]
        })
        return sub
    } catch (error) {
        console.log("checkSubsExist ERROR : ", error);
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

const deleteSub = async (subscriber, channel) => {
    try {
        const sub = await Subscription.deleteOne({
            $and: [{ subscriber }, { channel }]
        })
        return sub
    } catch (error) {
        console.log("deleteSub ERROR : ", error);
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

const createSub = async (subscriber, channel) => {
    try {
        const user = await Subscription.create({
            subscriber,
            channel,
        })
        return user
    } catch (error) {
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }

}
const getSubscribedChannelsData = async (subscriber) => {
    try {
        const channel = await Subscription.find({
            subscriber,
        })
            .populate("channel", "fullName email -_id")
            .select("-_id fullName email")
        return channel
    } catch (error) {
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

const getUserChannelSubscribersData = async (channel) => {
    try {
        const subscribers = await Subscription.find({
            channel,
        })
            .populate("subscriber", "fullName email -_id")
            .select("-_id fullName email")
        return subscribers
    } catch (error) {
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

export {
    checkSubsExist,
    deleteSub,
    createSub,
    getSubscribedChannelsData,
    getUserChannelSubscribersData
}