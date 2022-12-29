import ProductController from '#controller/v2/Product'
import { upload } from '#middleware'
import express from 'express'
import ConvertController from '#controller/Service/Convert'
import MailServer from '#controller/Service/MailServer'
import PaymentController from '#controller/Service/Payment'
const router = express.Router()
// Test route
router.get('/sku', upload.none(), new ConvertController().getSKU)

router.post('/variant', upload.none(), new ConvertController().getVariantOfSKU)

router.post('/attribute', upload.none(), new ConvertController().getAttribute)

router.post('/get-image', upload.none(), new ConvertController().getImageFromProduct)

router.post('/mail', upload.none(), new MailServer().sendMail)

// Public Routes

router.get('/payment/url_return', new PaymentController().onHandleReturnUrl)

export default router
