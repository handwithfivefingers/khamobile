import express from 'express'
import { upload } from '#middleware'
import CategoryController from '#controller/admin/Category'
import ProductCategoryController from '#controller/admin/ProductCategory'
import { isRequiresValidated, validateCreateCategory } from '#server/validator/category'

const router = express.Router()

const { createCategory, updateCategory, getCategory, getSingleCategory, getProductCategory } = CategoryController

router.get('/category', upload.none(), getCategory)

router.get('/category/:_id', upload.none(), getSingleCategory)

router.post(
  '/category/:_id',
  upload.fields([{ name: 'categoryImg', maxCount: 1 }]),
  validateCreateCategory,
  isRequiresValidated,
  updateCategory,
)

router.post(
  '/category',
  upload.fields([{ name: 'categoryImg', maxCount: 1 }]),
  validateCreateCategory,
  isRequiresValidated,
  createCategory,
)

router.get('/product_category', upload.none(), new ProductCategoryController().getCategory)

router.get('/product_category/:_id', upload.none(), new ProductCategoryController().getCategoryById)

router.post(
  '/product_category/:_id',
  upload.fields([{ name: 'image', maxCount: 1 }]),
  new ProductCategoryController().updateCategory,
)

export default router
