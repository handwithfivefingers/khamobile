import UserController from '#controller/v2/User'
import { upload, authenticating, userMiddleware } from '#middleware'
import express from 'express'

const router = express.Router()

router.post('/login', new UserController().LoginUser)

router.post('/register', new UserController().registerUser)

router.post('/authenticate', authenticating, new UserController().authenticateUser)

router.post('/logout', authenticating, new UserController().Logout)

router.post('/delivery', authenticating, new UserController().updateDeliveryInformation)

router.post('/information', authenticating, new UserController().updateInformation)

router.post('/password', authenticating, new UserController().updatePassword)

export default router
