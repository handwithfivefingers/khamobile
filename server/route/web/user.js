import UserController from '#controller/v2/User'
import { upload, authenticating } from '#middleware'
import express from 'express'

const router = express.Router()

router.post('/login', new UserController().LoginUser)

router.post('/register', new UserController().registerUser)

router.post('/authenticate', authenticating, new UserController().authenticateUser)

export default router
