import ProductController from '#controller/admin/Product'
import express from 'express'
// import ProductCategoryController from '#controller/admin/ProductCategory'

const router = express.Router()

router.get('/product', new ProductController().getProduct)

router.get('/product/:_id', new ProductController().getProductById)

router.post('/product/create', new ProductController().createProduct)

router.post('/product/update', new ProductController().updateProduct)

router.post('/product/delete', new ProductController().deleteProduct)

export default router
