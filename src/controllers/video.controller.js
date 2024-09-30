import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { convertToMMSS } from "../utils/app_utils.js"
import {
    addVideo, findVideoById, deleteVideoById,
    findVideoByIdAndOwner, updateVideoDetails,
    findAllVideo,
} from "../repositories/video.repository.js"


const getAllVideos = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 10, query, sortBy, sortType = 1, userId } = req.query

        let filter = {}
        let sortObject = {}

        if (userId) {
            filter.owner = userId
        }

        if (query) {
            filter["$or"] = [
                { title: new RegExp(query, 'i') },
                { description: new RegExp(query, 'i') }
            ]
        }

        if (sortBy) {
            sortObject[sortBy] = parseInt(sortType)
        }

        const allVideos = await findAllVideo(page, limit, filter, sortObject)
        if (allVideos?.length > 0) {
            return res.status(200).json(
                new ApiResponse(200, {
                    allVideos
                }, "Video details has been fetched Successfully")
            )
        } else {
            throw new ApiError(400, "No Video Found!")
        }
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }
})

const publishAVideo = asyncHandler(async (req, res) => {
    try {
        const { title, description } = req.body
        if (!title || !description) {
            throw new ApiError(400, "Invalid input(s)")
        }

        let videoFileLocalPath;
        let thumbnailLocalPath;

        if (req.files &&
            Array.isArray(req.files.thumbnail) &&
            req.files.thumbnail.length > 0) {
            thumbnailLocalPath = req.files.thumbnail[0].path
        }
        if (req.files &&
            Array.isArray(req.files.videoFile) &&
            req.files.videoFile.length > 0) {
            videoFileLocalPath = req.files.videoFile[0].path
        }

        if (!thumbnailLocalPath || !videoFileLocalPath) {
            throw new ApiError(400, "Files required")
        }

        const uploadVideo = await uploadOnCloudinary(videoFileLocalPath)

        if (!uploadVideo) {
            throw new ApiError(400, "Video file is required")
        }
        const videoDuration = convertToMMSS(uploadVideo.duration)
        const videoUrl = uploadVideo.url

        const uploadThumbnail = await uploadOnCloudinary(thumbnailLocalPath)

        if (!uploadThumbnail) {
            throw new ApiError(400, "Thumbnail file is required")
        }

        const addVideoResult = await addVideo(videoUrl, uploadThumbnail.url, title,
            description, uploadVideo.duration, req.user._id)


        return res.status(200).json(
            new ApiResponse(200, {
                addVideoResult
            }, "Video has been published Successfully")
        )
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }
})

const getVideoById = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params
        const video = await findVideoById(videoId)
        if (!video) {
            throw new ApiError(404, "Video not found")
        }
        return res.status(200).json(
            new ApiResponse(200, {
                video
            }, "Video details has been fetched Successfully")
        )
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }
})

const updateVideo = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params

        const { title, description } = req.body
        if (!title || !description) {
            throw new ApiError(400, "Invalid input(s)")
        }
        const userVideo = await findVideoByIdAndOwner(videoId, req.user._id)

        if (!userVideo) {
            throw new ApiError(400, "Video not found")
        }

        let updateFields = {
            title,
            description,
        }

        let thumbnailLocalPath;

        if (req.file && req.file.path.length > 0) {
            thumbnailLocalPath = req.file.path

            const uploadThumbnail = await uploadOnCloudinary(thumbnailLocalPath)

            if (uploadThumbnail) {
                updateFields.thumbnail = uploadThumbnail.url
            }
        }

        const updateVideoDetailsResult = await updateVideoDetails(videoId, updateFields)

        return res.status(200).json(
            new ApiResponse(200, {
                updateVideoDetailsResult
            }, "Video details has been updated Successfully")
        )
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }

})

const deleteVideo = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params
        const video = await deleteVideoById(videoId)
        if (!video) {
            throw new ApiError(404, "Video not found")
        }
        return res.status(200).json(
            new ApiResponse(200, {
                video
            }, "Video has been deleted Successfully")
        )
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params
        const userVideo = await findVideoByIdAndOwner(videoId, req.user._id)

        if (!userVideo) {
            throw new ApiError(400, "Video not found")
        }
        if (userVideo.isPublished) {
            const updateVideoDetailsResult = await updateVideoDetails(videoId, {
                isPublished: false
            })
            return res.status(200).json(
                new ApiResponse(200, {
                    updateVideoDetailsResult
                }, "Video has been unpublished Successfully")
            )
        } else {
            const updateVideoDetailsResult = await updateVideoDetails(videoId, {
                isPublished: true
            })
            return res.status(200).json(
                new ApiResponse(200, {
                    updateVideoDetailsResult
                }, "Video has been published Successfully")
            )
        }
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}