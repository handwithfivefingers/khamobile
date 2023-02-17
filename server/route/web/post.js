import PostController from '#controller/v2/Post'
import express from 'express'

const router = express.Router()

router.get('/post', new PostController().getPosts)
router.get('/post/:slug', new PostController().getSinglePost)

export default router
