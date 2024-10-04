import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {
    addPlaylist, findPlaylistById,
    updatePlaylistDetails, deletePlaylistById,
    findAllPlaylistByOwner,
} from "../repositories/playlist.repository.js"
import { findVideoById } from "../repositories/video.repository.js"


const createPlaylist = asyncHandler(async (req, res) => {
    try {
        const { name, description } = req.body
        if (!name || !description) {
            throw new ApiError(400, "Invalid input(s)")
        }

        const addPlResult = await addPlaylist(name, description, req.user._id)


        return res.status(200).json(
            new ApiResponse(200, {
                addPlResult
            }, "Playlist has been created Successfully")
        )
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params

        const allPlaylist = await findAllPlaylistByOwner(userId)
        if (allPlaylist?.length > 0) {
            return res.status(200).json(
                new ApiResponse(200, {
                    allPlaylist
                }, "Playlist details has been fetched Successfully")
            )
        } else {
            throw new ApiError(400, "No Playlist Found!")
        }
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }
})

const getPlaylistById = asyncHandler(async (req, res) => {
    try {
        const { playlistId } = req.params
        const playlist = await findPlaylistById(playlistId)
        if (!playlist) {
            throw new ApiError(404, "Playlist not found")
        }
        return res.status(200).json(
            new ApiResponse(200, {
                playlist
            }, "Playlist details has been fetched Successfully")
        )
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {

    try {
        const { playlistId, videoId } = req.params

        if (!playlistId || !videoId) {
            throw new ApiError(400, "Invalid input(s)")
        }

        const playlist = await findPlaylistById(playlistId)


        if (!playlist) {
            throw new ApiError(404, "Playlist not found")
        }

        const video = await findVideoById(videoId)
        if (!video) {
            throw new ApiError(404, "Video not found")
        }

        console.log("addVideoToPlaylist playlist : ", playlist);
        if (playlist.videos.includes(videoId)) {
            throw new ApiError(400, "This video is already available in the playlist")
        }

        playlist.videos.push(videoId)

        await playlist.save()

        return res.status(200).json(
            new ApiResponse(200, {
                playlist
            }, "Video has been added Successfully")
        )
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    try {
        const { playlistId, videoId } = req.params

        if (!playlistId || !videoId) {
            throw new ApiError(400, "Invalid input(s)")
        }

        const playlist = await findPlaylistById(playlistId)


        if (!playlist) {
            throw new ApiError(404, "Playlist not found")
        }

        const video = await findVideoById(videoId)
        if (!video) {
            throw new ApiError(404, "Video not found")
        }

        console.log("removeVideoFromPlaylist playlist : ", playlist);
        if (!playlist.videos.includes(videoId)) {
            throw new ApiError(400, "This video is not available in the playlist")
        }

        playlist.videos.pull(videoId)

        await playlist.save()

        return res.status(200).json(
            new ApiResponse(200, {
                playlist
            }, "Video has been removed Successfully")
        )
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }

})

const deletePlaylist = asyncHandler(async (req, res) => {
    try {
        const { playlistId } = req.params
        const playlist = await deletePlaylistById(playlistId)
        if (!playlist) {
            throw new ApiError(404, "Playlist not found")
        }
        return res.status(200).json(
            new ApiResponse(200, {
                playlist
            }, "Playlist has been deleted Successfully")
        )
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }
})

const updatePlaylist = asyncHandler(async (req, res) => {
    try {
        const { playlistId } = req.params
        const { name, description } = req.body
        if (!name || !description) {
            throw new ApiError(400, "Invalid input(s)")
        }
        const playlist = await findPlaylistById(playlistId,)

        if (!playlist) {
            throw new ApiError(400, "Playlist not found")
        }

        let updateFields = {
            name,
            description,
        }


        const updatePlaylistDetailsResult =
            await updatePlaylistDetails(playlistId, updateFields)

        return res.status(200).json(
            new ApiResponse(200, {
                updatePlaylistDetailsResult
            }, "Playlist details has been updated Successfully")
        )
    } catch (error) {
        throw new ApiError(400, error?.message || ERROR_MSG_SOMETHING_WENT_WRONG)
    }
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}