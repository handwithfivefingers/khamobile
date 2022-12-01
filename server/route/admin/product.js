import ProductController from '#controller/admin/Product'
import PuppeteerController from '#controller/Service/Puppeteer'
import { upload } from '#middleware'
import express, { Router } from 'express'
// import ProductCategoryController from '#controller/admin/ProductCategory'

const router = express.Router()

router.get('/product', new ProductController().getProduct)

router.get('/product/:_id', new ProductController().getProductById)

router.post('/product/create', upload.fields([{ name: 'img', maxCount: 10 }]), new ProductController().createProduct)

router.post('/product/update', upload.fields([{ name: 'img', maxCount: 10 }]), new ProductController().updateProduct)
export default router
