import { Comment } from "../db/models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"

const createComment = async (content, owner, video) => {
    try {
        const create = await Comment.create({
            content,
            video,
            owner,
        })
        return create
    } catch (error) {
        throw new ApiError(500, error?.message || "Internal Server Error!!", [error.stack])
    }
}

const findAllVideoComment = async (page, limit, videoId) => {
    try {
        return await Comment.find(
            {
                video: videoId
            }
        )
            .skip((page - 1) * limit)
            .limit(Number(limit))

    } catch (error) {
        console.log("findAllVideoComment ERRO : ", error);

        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

const updateCommentDetails = async (id, updatedFields, excludeFields) => {
    try {
        console.log("updateVideoDetails updatedFields : ", updatedFields);
        return await Comment.findByIdAndUpdate(id,
            updatedFields,
            {
                new: true
            }).select(excludeFields)
    } catch (error) {
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

const deleteCommentById = async (id) => {
    try {
        const deleted = await Comment.deleteOne({
            _id: id
        })
        return deleted
    } catch (error) {
        console.log("deleteSub ERROR : ", error);
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

export {
    createComment,
    findAllVideoComment,
    updateCommentDetails,
    deleteCommentById,
}