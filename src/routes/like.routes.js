import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
} from "../controllers/like.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { API_VERSION } from "../constants.js"

const LIKES_ROUTE = `${API_VERSION}/likes`
const TOGGLE_VIDEO_LIKE_ROUTE = "/toggle/v/:videoId"
const TOGGLE_COMMENT_LIKE_ROUTE = "/toggle/c/:commentId"
const TOGGLE_TWEET_LIKE_ROUTE = "/toggle/t/:tweetId"
const GET_LIKED_VIDEO_ROUTE = "/videos"

const likesRouter = Router();
likesRouter.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

likesRouter.route(TOGGLE_VIDEO_LIKE_ROUTE).post(toggleVideoLike);
likesRouter.route(TOGGLE_COMMENT_LIKE_ROUTE).post(toggleCommentLike);
likesRouter.route(TOGGLE_TWEET_LIKE_ROUTE).post(toggleTweetLike);
likesRouter.route(GET_LIKED_VIDEO_ROUTE).get(getLikedVideos);

export { likesRouter, LIKES_ROUTE }