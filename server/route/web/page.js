import PageController from '#controller/v2/Page'
import { userMiddleware, authenticating } from '#middleware'
import express from 'express'

const router = express.Router()

router.post('/page', new PageController().getPage)

export default router
