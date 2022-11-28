import ProductController from '#controller/v2/Product'
import { upload } from '#middleware'
import express from 'express'

const router = express.Router()

router.get('/product/:slug', new ProductController().getProductSlug)

router.get('/home', new ProductController().getHomeProduct)

export default router
