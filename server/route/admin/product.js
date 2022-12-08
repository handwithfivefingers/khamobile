import ProductController from '#controller/admin/Product'
import PuppeteerController from '#controller/Service/Puppeteer'
import { upload } from '#middleware'
import express, { Router } from 'express'
// import ProductCategoryController from '#controller/admin/ProductCategory'

const router = express.Router()

router.get('/product', new ProductController().getProduct)

router.get('/product/:_id', new ProductController().getProductById)

router.post('/product/create', new ProductController().createProduct)

router.post('/product/update', new ProductController().updateProduct)
export default router
