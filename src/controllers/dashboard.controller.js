import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { totalVideoCountByOwner, totalVideoViewsByOwner, findAllVideoByOwner } from "../repositories/video.repository.js"
import { getUserChannelProfileData } from "../repositories/user.repository.js"

const getChannelStats = asyncHandler(async (req, res) => {
    try {
        const user = req.user

        const totalVideos = await totalVideoCountByOwner(user._id)

        const totalVideoViews = await totalVideoViewsByOwner(user._id)

        const getUserChannelProfile = await getUserChannelProfileData(user, user.username)

        return res.status(200).json(
            new ApiResponse(200,
                {
                    totalVideos,
                    totalVideoViews,
                    subscribersCount: getUserChannelProfile[0].subscribersCount
                },
                "Fetched channel stats successfully")
        )
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }
})

const getChannelVideos = asyncHandler(async (req, res) => {
    try {
        const user = req.user

        const videos = await findAllVideoByOwner(user._id)
        console.log("getChannelVideos videos : ", videos);

        if (videos?.length === 0) {
            throw new ApiError(404, "No Videos found")
        }

        return res.status(200).json(
            new ApiResponse(200,
                {
                    videos,
                },
                "Fetched channel stats successfully")
        )
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }
})

export {
    getChannelStats,
    getChannelVideos
}