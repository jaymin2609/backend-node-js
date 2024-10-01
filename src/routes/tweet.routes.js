import { Router } from 'express';
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { API_VERSION } from "../constants.js"

const TWEETS_ROUTE = `${API_VERSION}/tweets`
const CREATE_TWEET_ROUTE = "/create"
const GET_USER_TWEET_ROUTE = "/user/:userId"
const TWEET_CRUD_ROUTE = "/:tweetId"

const tweetRouter = Router();
tweetRouter.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

tweetRouter.route(CREATE_TWEET_ROUTE).post(createTweet);

tweetRouter.route(GET_USER_TWEET_ROUTE).get(getUserTweets);

tweetRouter.route(TWEET_CRUD_ROUTE)
    .patch(updateTweet)
    .delete(deleteTweet);

export { tweetRouter, TWEETS_ROUTE }