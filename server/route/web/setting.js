import express from 'express'
import SettingController from '#controller/admin/Setting'
const router = express.Router()

router.get('/menu', new SettingController().getSetting)

export default router
