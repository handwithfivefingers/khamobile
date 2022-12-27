import express from 'express'
import OrderAdmin from '#controller/admin/Order'

const router = express.Router()

router.post('/orders', new OrderAdmin().getOrders)

export default router
