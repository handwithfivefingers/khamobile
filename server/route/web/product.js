import ProductController from '#controller/v2/Product'
import express from 'express'

const router = express.Router()

router.get('/products', new ProductController().getProduct)

router.get('/product', new ProductController().filterProduct)

router.get('/product/:slug', new ProductController().getProductSlug)

router.post('/product_id', new ProductController().getProductById)

router.get('/home', new ProductController().getHomeProduct)

router.post('/search', new ProductController().searchProduct)

router.get('/productfeed', new ProductController().getProductFeed)

export default router
