import express from 'express'
import { upload } from '#middleware'
import CategoryController from '#controller/admin/Category'
import ProductCategoryController from '#controller/admin/ProductCategory'
import { isRequiresValidated, validateCreateCategory } from '#server/validator/category'

const router = express.Router()

const { createCategory, updateCategory, getCategory, getSingleCategory, getProductCategory } = CategoryController

router.get('/category', getCategory)

router.get('/category/:_id', getSingleCategory)

router.post('/category/:_id', validateCreateCategory, isRequiresValidated, updateCategory)

router.post('/category', validateCreateCategory, isRequiresValidated, createCategory)

router.get('/product_category', new ProductCategoryController().getCategory)

router.get('/product_category/:_id', new ProductCategoryController().getCategoryById)

router.post('/product_category', new ProductCategoryController().createCategory)

router.post('/product_category/:_id', new ProductCategoryController().updateCategory)

router.delete('/product_category/:_id', new ProductCategoryController().deleteCategoryById)

export default router
