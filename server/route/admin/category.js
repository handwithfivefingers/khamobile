import express from 'express';
import { upload } from '#middleware';
import CategoryController from '#controller/admin/Category';
import { isRequiresValidated, validateCreateCategory } from '#server/validator/category';

const router = express.Router();

const { createCategory } = CategoryController;

router.post('/category', upload.single('img'), validateCreateCategory, isRequiresValidated, createCategory);

// router.post('/category', validateCreateCategory, isRequiresValidated, (req, res, next) => {
// 	console.log(req.files);
// 	console.log(req.fields);
// 	console.log(req.body);
// 	// console.log(req)
// 	return res.sendStatus(200);
// });

export default router;
