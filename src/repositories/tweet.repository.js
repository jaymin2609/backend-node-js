import { Tweet } from "../db/models/tweet.model.js"
import { ApiError } from "../utils/ApiError.js"

const addTweet = async (content, owner) => {
    try {
        const user = await Tweet.create({
            content,
            owner
        })
        return user
    } catch (error) {
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

const findAllTweetForOwner = async (owner) => {
    try {
        return await Tweet.find(
            {
                owner: owner
            }
        )
            .select(
                "-createdAt -updatedAt"
            )
    } catch (error) {
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

const updateTweetDetails = async (id, updatedFields, excludeFields) => {
    try {
        console.log("updateTweetDetails updatedFields : ", updatedFields);
        console.log("updateTweetDetails id : ", id);
        return await Tweet.findByIdAndUpdate(id,
            updatedFields,
            {
                new: true
            }).select(excludeFields)
    } catch (error) {
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

const findTweetByIdAndOwner = async (id, owner) => {
    try {
        return await Tweet.findOne(
            {
                _id: id,
                owner: owner
            }
        )
            .select(
                "-createdAt -updatedAt"
            )
    } catch (error) {
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

const deleteTweetById = async (id) => {
    try {
        const deleted = await Tweet.deleteOne({
            _id: id
        })
        return deleted
    } catch (error) {
        console.log("deleteSub ERROR : ", error);
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}


export {
    addTweet,
    findAllTweetForOwner,
    updateTweetDetails,
    findTweetByIdAndOwner,
    deleteTweetById,
}