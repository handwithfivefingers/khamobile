import express from 'express'
import PageController from '#controller/admin/Page'

const router = express.Router()

router.get('/page', new PageController().getAllPages)

router.post('/page', new PageController().createPage)


router.get('/page/:_id', new PageController().getPageById)

router.post('/page/:_id', new PageController().updatePage)

export default router
