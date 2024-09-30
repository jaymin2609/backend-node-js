import { Video } from "../db/models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import mongoose, { Schema } from "mongoose"

const addVideo = async (videoFile, thumbnail, title, description,
    duration, owner) => {
    try {
        const user = await Video.create({
            videoFile,
            thumbnail,
            title,
            description,
            duration,
            owner
        })
        return user
    } catch (error) {
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }

}

const findVideoById = async (id) => {
    try {
        return await Video.findById(id)
            .select(
                "-createdAt -updatedAt"
            )
    } catch (error) {
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

const findVideoByIdAndOwner = async (id, owner) => {
    try {
        return await Video.findOne(
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

const deleteVideoById = async (id) => {
    try {
        const deleted = await Video.deleteOne({
            _id: id
        })
        return deleted
    } catch (error) {
        console.log("deleteSub ERROR : ", error);
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

const updateVideoDetails = async (id, updatedFields, excludeFields) => {
    try {
        console.log("updateVideoDetails updatedFields : ", updatedFields);
        return await Video.findByIdAndUpdate(id,
            updatedFields,
            {
                new: true
            }).select(excludeFields)
    } catch (error) {
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

const findAllVideo = async (page, limit, filter, sortObject) => {
    try {
        return await Video.find(
            filter
        )
            .sort(sortObject)
            .skip((page - 1) * limit)
            .limit(Number(limit))

    } catch (error) {
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}


export {
    addVideo,
    findVideoById,
    deleteVideoById,
    updateVideoDetails,
    findVideoByIdAndOwner,
    findAllVideo,
}