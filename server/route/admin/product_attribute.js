import express from 'express'
import { upload } from '#middleware'

import ProductAttributeController from '#controller/admin/ProductAttribute'
const router = express.Router()

router.get('/product_attribute', new ProductAttributeController().getAttributeWithTerm)

router.get('/product_attribute_list', new ProductAttributeController().getAttribute)

router.post('/product_attribute', new ProductAttributeController().createAttributes)

router.get('/product_attribute/:_id', new ProductAttributeController().getAttributeWithTermById)

router.post('/product_attribute/:_id', new ProductAttributeController().handleSaveAttributesTerm)

export default router
