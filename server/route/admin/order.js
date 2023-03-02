import express from 'express'
import OrderAdmin from '#controller/admin/Order'

const router = express.Router()

router.post('/orders', new OrderAdmin().getOrders)

router.get('/orders-chart', new OrderAdmin().getOrderByChart)

export default router
