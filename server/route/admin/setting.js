import express from 'express'
import SettingController from '#controller/admin/Setting'

const router = express.Router()

router.get('/setting', new SettingController().getSetting)

router.post('/setting', new SettingController().createSetting)

router.post('/setting/:_id', new SettingController().updateSetting)

export default router
