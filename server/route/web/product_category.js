import ProductCategoryController from '#controller/v2/ProductCategory'
import { upload } from '#middleware'
import express from 'express'

const router = express.Router()

router.get('/product_category', new ProductCategoryController().getCategory)

router.get('/product_category/:slug', new ProductCategoryController().getCategoryBySlug)

export default router
