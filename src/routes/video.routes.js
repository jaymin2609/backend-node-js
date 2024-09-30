import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { API_VERSION } from "../constants.js"

const VIDEOS_ROUTE = `${API_VERSION}/videos`
const VIDEO_CREATE_ALL_ROUTE = "/create-all"
const VIDEO_OPERATION_ROUTE = "/v/:videoId"
const TOGGLE_PUBLISH_ROUTE = "/toggle/publish/:videoId"

const videoRouter = Router();
videoRouter.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

videoRouter
    .route(VIDEO_CREATE_ALL_ROUTE)
    .get(getAllVideos)
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },

        ]),
        publishAVideo
    );

videoRouter
    .route(VIDEO_OPERATION_ROUTE)
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

videoRouter.route(TOGGLE_PUBLISH_ROUTE).patch(togglePublishStatus);

export { videoRouter, VIDEOS_ROUTE }