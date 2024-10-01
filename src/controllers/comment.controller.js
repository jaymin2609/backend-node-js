import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import {
    createComment, findAllVideoComment, updateCommentDetails,
    deleteCommentById
} from "../repositories/comment.repository.js"
import { findVideoById } from "../repositories/video.repository.js"

const getVideoComments = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query
        const { videoId } = req.params

        if (!videoId) {
            throw new ApiError(400, "Invalid input(s)")
        }
        const video = await findVideoById(videoId)
        if (!video) {
            throw new ApiError(400, "Video not found")
        }

        const allVideoComments = await findAllVideoComment(page, limit, videoId)
        if (allVideoComments?.length > 0) {
            return res.status(200).json(
                new ApiResponse(200, {
                    allVideoComments
                }, "Commnets details has been fetched Successfully")
            )
        } else {
            throw new ApiError(400, "No Video Commnet Found!")
        }
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }

})

const addComment = asyncHandler(async (req, res) => {
    try {
        const { content } = req.body
        const { videoId } = req.params

        if (!content) {
            throw new ApiError(400, "Invalid input(s)")
        }

        if (!videoId) {
            throw new ApiError(400, "Invalid input(s)")
        }
        const video = await findVideoById(videoId)
        if (!video) {
            throw new ApiError(400, "Video not found")
        }

        const createCommentResult = await createComment(content, req.user._id, videoId)

        return res.status(200).json(
            new ApiResponse(200, {
                createCommentResult
            }, "Commnet has been added Successfully")
        )
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }
})

const updateComment = asyncHandler(async (req, res) => {
    try {
        const { commentId } = req.params
        const { content } = req.body
        if (!content) {
            throw new ApiError(400, "Invalid input(s)")
        }
        if (!commentId) {
            throw new ApiError(400, "Invalid input(s)")
        }

        const updateCommentDetailsResult = await updateCommentDetails(commentId, {
            content
        })

        return res.status(200).json(
            new ApiResponse(200, {
                updateCommentDetailsResult
            }, "Commnet details has been updated Successfully")
        )
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }
})

const deleteComment = asyncHandler(async (req, res) => {
    try {
        const { commentId } = req.params
        const comment = await deleteCommentById(commentId)
        if (!comment) {
            throw new ApiError(404, "Comment not found")
        }
        return res.status(200).json(
            new ApiResponse(200, {
                comment
            }, "Comment has been deleted Successfully")
        )
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}