import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { API_VERSION } from "../constants.js"

const SUBS_ROUTE = `${API_VERSION}/subscriptions`
const SUB_CRUD_ROUTE = "/c/:channelId"
const GET_USER_CHANNEL_SUBS_ROUTE = "/u/:subscriberId"

const subsRouter = Router();
subsRouter.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

subsRouter
    .route(SUB_CRUD_ROUTE)
    .get(getUserChannelSubscribers)
    .post(toggleSubscription);



subsRouter.route(GET_USER_CHANNEL_SUBS_ROUTE).get(getSubscribedChannels);

export { subsRouter, SUBS_ROUTE }