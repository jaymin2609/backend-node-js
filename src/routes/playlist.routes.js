import { Router } from 'express';
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
} from "../controllers/playlist.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { API_VERSION } from "../constants.js"

const PLAYLISTS_ROUTE = `${API_VERSION}/playlists`
const CREATE_PLAYLIST_ROUTE = "/create"
const PLAYLIST_CRUD_ROUTE = "/:playlistId"
const ADD_VIDEO_PLAYLIST_ROUTE = "/add/:videoId/:playlistId"
const REMOVE_VIDEO_PLAYLIST_ROUTE = "/remove/:videoId/:playlistId"
const GET_USER_PLAYLIST_ROUTE = "/user/:userId"

const playlistRouter = Router();

playlistRouter.use(verifyJWT);


playlistRouter.route(CREATE_PLAYLIST_ROUTE)
    .post(createPlaylist)

playlistRouter
    .route(PLAYLIST_CRUD_ROUTE)
    .get(getPlaylistById)
    .patch(updatePlaylist)
    .delete(deletePlaylist);

playlistRouter.route(ADD_VIDEO_PLAYLIST_ROUTE).patch(addVideoToPlaylist);

playlistRouter.route(REMOVE_VIDEO_PLAYLIST_ROUTE).patch(removeVideoFromPlaylist);

playlistRouter.route(GET_USER_PLAYLIST_ROUTE).get(getUserPlaylists);

export { playlistRouter, PLAYLISTS_ROUTE }