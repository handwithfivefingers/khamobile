import express from 'express'
import { upload } from '#middleware'
import PostController from '#controller/admin/Post'
import { isRequiresValidated, validateCreatePost } from '#server/validator/post'

const router = express.Router()

const { createPost, updatePost, getPost, getSinglePost } = PostController

router.get('/post', upload.none(), getPost)

router.get('/post/:_id', upload.none(), getSinglePost)

router.post('/post', upload.none(), validateCreatePost, isRequiresValidated, createPost)

router.post(
  '/post/:_id',
  upload.fields([{ name: 'postImg', maxCount: 1 }]),
  validateCreatePost,
  isRequiresValidated,
  updatePost,
)

export default router
