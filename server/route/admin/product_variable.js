import express from 'express';
import { upload } from '#middleware';
import ProductVariableController from '#controller/admin/ProductVariable';
import { variableValidate, isRequiresValidated } from '#server/validator/product_variable';
const router = express.Router();

const { getVariable, createVariable, updateVariable } = new ProductVariableController();

router.get('/product/variable', upload.none(), getVariable);

router.post('/product/variable', variableValidate, isRequiresValidated, createVariable);

router.post('/product/variable/:_id', variableValidate, isRequiresValidated, updateVariable);

export default router;
