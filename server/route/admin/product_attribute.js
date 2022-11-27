import express from 'express'
import { upload } from '#middleware'
// import ProductVariableController from '#controller/admin/ProductVariable';
// import { variableValidate, isRequiresValidated } from '#server/validator/product_variable';
import ProductAttributeController from '#controller/admin/ProductAttribute'
const router = express.Router()

// const { getVariable, createVariable, updateVariable } = new ProductVariableController();

// router.get('/product/variable', upload.none(), getVariable);

// router.post('/product/variable', variableValidate, isRequiresValidated, createVariable);

// router.post('/product/variable/:_id', variableValidate, isRequiresValidated, updateVariable);

router.get('/product_attribute', new ProductAttributeController().getAttribute)

export default router
