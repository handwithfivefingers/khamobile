import express from 'express';
import { upload } from '#middleware';
import CategoryController from '#controller/admin/Category';
import { isRequiresValidated, validateCreateCategory } from '#server/validator/category';

const router = express.Router();

const { createCategory, updateCategory, getCategory, getSingleCategory } = CategoryController;

router.get('/category', upload.none(), getCategory);

router.get('/category/:_id', upload.none(), getSingleCategory);

router.post('/category/:_id', upload.fields([{ name: 'categoryImg', maxCount: 1 }]), validateCreateCategory, isRequiresValidated, updateCategory);

router.post('/category', upload.fields([{ name: 'categoryImg', maxCount: 1 }]), validateCreateCategory, isRequiresValidated, createCategory);

export default router;
