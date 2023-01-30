import OrderController from '#controller/v2/Order'
import { userMiddleware, authenticating } from '#middleware'
import express from 'express'

const router = express.Router()

// router.get('/order', new OrderController().getOrderByUser)

router.post('/order', new OrderController().handleCreateOrder)

router.post('/orders', authenticating, userMiddleware, new OrderController().getOrders)

router.get('/order/:_id', new OrderController().getOrderById)

export default router
