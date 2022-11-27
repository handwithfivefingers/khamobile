import ProductController from '#controller/v2/Product'
import { upload } from '#middleware'
import express from 'express'

const router = express.Router()

// const { getProductBySlug } = new ProductController()

// router.get('/product', upload.none(), getProductBySlug)

// router.get('/product/:slug', upload.none(), getProductBySlug)


router.get('/product/:slug', new ProductController().getProductSlug)

export default router
