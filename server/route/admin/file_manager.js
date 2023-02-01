import express from 'express'
import FileManagerController from '#controller/admin/FileManager'

const router = express.Router()

router.get('/file-manager', new FileManagerController().getListfile)

export default router
