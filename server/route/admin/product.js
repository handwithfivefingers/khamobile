import ProductController from '#controller/admin/Product'
import PuppeteerController from '#controller/Service/Puppeteer'
import { upload } from '#middleware'
import express, { Router } from 'express'
// import ProductCategoryController from '#controller/admin/ProductCategory'

const router = express.Router()

// const { getProducts, createMutipleProduct, updateProduct, getProductById } = new ProductController()
// const { createCategory, getCategory } = new ProductCategoryController()

// const { getSKU } = new PuppeteerController()

// router.get('/product', upload.none(), getProducts)

// router.get('/product/:_id', upload.none(), getProductById)

// router.post('/product/create', upload.fields([{ name: 'img', maxCount: 10 }]), createMutipleProduct)

// router.post('/product/update/:_id', upload.fields([{ name: 'img' }]), updateProduct)

// router.post('/crawler', getSKU)

// router.get('/product_cate', getCategory)

router.get('/product', new ProductController().getProduct)

router.get('/product/:_id', new ProductController().getProductById)


router.post('/product/create', new ProductController().createProduct)
export default router
