import ProductController from '#controller/admin/Product'
import { upload } from '#middleware'
import express from 'express'

const router = express.Router()

const { getProducts, createProduct, updateProduct, getProductById } = new ProductController()


router.get('/product', upload.none(), getProducts)

router.get('/product/:_id', upload.none(), getProductById)

router.post('/product/create', upload.fields([{ name: 'img', maxCount: 10 }]), createProduct)

router.post('/product/update/:_id', upload.fields([{ name: 'img' }]), updateProduct)

export default router
