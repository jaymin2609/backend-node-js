import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(express.static("public"))
app.use(cookieParser())

// Routes import

import { userRouter, USER_ROUTE } from "./routes/user.routes.js"
import { subsRouter, SUBS_ROUTE } from "./routes/subscription.routes.js"
import { videoRouter, VIDEOS_ROUTE } from "./routes/video.routes.js"
import { tweetRouter, TWEETS_ROUTE } from "./routes/tweet.routes.js"
import { commentRouter, COMMENT_ROUTE } from "./routes/comment.routes.js"
import { likesRouter, LIKES_ROUTE } from "./routes/like.routes.js"
import { dashboardRouter, DASHBOARD_ROUTE } from "./routes/dashboard.routes.js"
import { playlistRouter, PLAYLISTS_ROUTE } from "./routes/playlist.routes.js"
import { healthCheckRouter, HEALTH_CHECK_ROUTE } from "./routes/healthcheck.routes.js"

// Routes declaration
app.use(USER_ROUTE, userRouter)

app.use(SUBS_ROUTE, subsRouter)

app.use(VIDEOS_ROUTE, videoRouter)

app.use(TWEETS_ROUTE, tweetRouter)

app.use(COMMENT_ROUTE, commentRouter)

app.use(LIKES_ROUTE, likesRouter)

app.use(DASHBOARD_ROUTE, dashboardRouter)

app.use(PLAYLISTS_ROUTE, playlistRouter)

app.use(HEALTH_CHECK_ROUTE, healthCheckRouter)

export { app }