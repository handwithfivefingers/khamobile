import express from 'express';
import { upload } from '#middleware';
import CategoryController from '#controller/admin/Category';
import { isRequiresValidated, validateCreateCategory } from '#server/validator/category';

const router = express.Router();

const { createCategory, updateCategory } = CategoryController;

router.post('/category', upload.fields([{ name: 'categoryImg', maxCount: 1 }]), validateCreateCategory, isRequiresValidated, createCategory);

router.post('/category/:_id', upload.fields([{ name: 'categoryImg', maxCount: 1 }]), validateCreateCategory, isRequiresValidated, updateCategory);

export default router;
