// import ProductController from '#controller/v2/Product'
// import { upload, authenticating } from '#middleware'
import express from 'express'
import Province from '#controller/Service/Province'
const router = express.Router()

router.get('/province', new Province().getProvince)

export default router
