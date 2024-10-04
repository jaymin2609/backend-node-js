import { Router } from 'express';
import { healthcheck } from "../controllers/healthcheck.controller.js"
import { API_VERSION } from "../constants.js"

const HEALTH_CHECK_ROUTE = `${API_VERSION}/healthCheck`

const healthCheckRouter = Router();

healthCheckRouter.route('/').get(healthcheck);

export { healthCheckRouter, HEALTH_CHECK_ROUTE }