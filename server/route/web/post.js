import PostController from '#controller/v2/Post'
import { upload, authenticating, userMiddleware } from '#middleware'
import express from 'express'

const router = express.Router()

router.get('/post/:slug', new PostController().getSinglePost)

export default router
