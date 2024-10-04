import { Playlist } from "../db/models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import mongoose, { Schema } from "mongoose"

const addPlaylist = async (name, description, owner) => {
    try {
        const add = await Playlist.create({
            name,
            description,
            owner

        })
        return add
    } catch (error) {
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }

}

const findPlaylistById = async (id) => {
    try {
        return await Playlist.findById(id)
            .select(
                "-createdAt -updatedAt"
            )
    } catch (error) {
        throw new ApiError(500, error?.message || "Internal Server Error!!", [error.stack])
    }
}

const updatePlaylistDetails = async (id, updatedFields, excludeFields) => {
    try {
        console.log("updatePlaylistDetails updatedFields : ", updatedFields);
        return await Playlist.findByIdAndUpdate(id,
            updatedFields,
            {
                new: true
            }).select(excludeFields)
    } catch (error) {
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

const deletePlaylistById = async (id) => {
    try {
        const deleted = await Playlist.deleteOne({
            _id: id
        })
        return deleted
    } catch (error) {
        console.log("deletePlaylistById ERROR : ", error);
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

const findAllPlaylistByOwner = async (owner) => {
    try {
        console.log("findAllPlaylistByOwner owner : ", owner);

        return await Playlist.find(
            { owner }
        )
    } catch (error) {
        throw new ApiError(500, "Internal Server Error!!", [error.stack])
    }
}

export {
    addPlaylist,
    findPlaylistById,
    updatePlaylistDetails,
    deletePlaylistById,
    findAllPlaylistByOwner,
}