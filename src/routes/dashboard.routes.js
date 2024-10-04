import { Router } from 'express';
import {
    getChannelStats,
    getChannelVideos,
} from "../controllers/dashboard.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { API_VERSION } from "../constants.js"

const DASHBOARD_ROUTE = `${API_VERSION}/dashboard`
const STATS_ROUTE = "/stats"
const VIDEOS_ROUTE = "/videos"

const dashboardRouter = Router();

dashboardRouter.use(verifyJWT);

dashboardRouter.route(STATS_ROUTE).get(getChannelStats);

dashboardRouter.route(VIDEOS_ROUTE).get(getChannelVideos);

export { dashboardRouter, DASHBOARD_ROUTE }