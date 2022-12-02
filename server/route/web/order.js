import OrderController from '#controller/v2/Order'
import { upload } from '#middleware'
import express from 'express'

const router = express.Router()

router.post('/order', new OrderController().createOrder)
router.get('/order/:_id', new OrderController().getOrderById)

export default router
