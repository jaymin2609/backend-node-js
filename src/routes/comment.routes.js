import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { API_VERSION } from "../constants.js"

const COMMENT_ROUTE = `${API_VERSION}/comments`
const CREATE_GET_COMMENT_ROUTE = "/:videoId"
const DEL_PATCH_COMMENT_ROUTE = "/c/:commentId"

const commentRouter = Router();

commentRouter.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

commentRouter.route(CREATE_GET_COMMENT_ROUTE)
    .get(getVideoComments)
    .post(addComment);

commentRouter.route(DEL_PATCH_COMMENT_ROUTE)
    .delete(deleteComment)
    .patch(updateComment);

export { commentRouter, COMMENT_ROUTE }