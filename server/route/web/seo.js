import SeoController from '#controller/v2/Seo'
import express from 'express'

const router = express.Router()

router.get('/seo', new SeoController().getHomeSeo)
router.get('/seo-about', new SeoController().getAboutUsSeo)
router.get('/seo-post', new SeoController().getPostSeo)
router.get('/seo-category', new SeoController().getCategorySeo)
router.get('/seo-category/:slug', new SeoController().getSingleProductCategorySeo)
router.get('/seo-product', new SeoController().getProductSeo)

export default router
