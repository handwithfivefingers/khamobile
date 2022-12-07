import ProductController from '#controller/v2/Product'
import { upload } from '#middleware'
import express from 'express'
import ConvertController from '#controller/Service/Convert'
import MailServer from '#controller/Service/MailServer'
const router = express.Router()

router.get('/sku', upload.none(), new ConvertController().getSKU)

// router.get('/sku/:_id', upload.none(), new ConvertController().getSKUById)

router.post('/variant', upload.none(), new ConvertController().getVariantOfSKU)

router.post('/attribute', upload.none(), new ConvertController().getAttribute)

router.post('/mail', upload.none(), new MailServer().sendMail)

export default router
