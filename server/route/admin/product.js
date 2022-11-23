import express from 'express'
import { upload } from '#middleware'
import ProductController from '#controller/admin/Product'
// import { isRequiresValidated, validateCreatePost } from '#server/validator/post';

const router = express.Router()

const { getProducts, createProduct, getProductBySlug, updateProduct, createMutipleProduct , getVariantProduct, getAllProduct} = new ProductController()

router.get('/product', upload.none(), getProducts)

router.post('/product', upload.fields([{ name: 'img', maxCount: 10 }]), createProduct)

/**
 * Testing
 */
router.get('/product/test', upload.none(), getAllProduct)

router.get('/product/test/:slug', upload.none(), getVariantProduct)
/**
 * Testing
 */
router.post('/product/test', upload.none(), createMutipleProduct)

router.get('/product/:slug', upload.none(), getProductBySlug)

// router.post('/post', upload.fields([{ name: 'postImg', maxCount: 1 }]),  createPost);

router.post('/product/:_id', upload.fields([{ name: 'img' }]), updateProduct)

export default router
