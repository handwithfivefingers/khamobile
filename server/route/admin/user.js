import express from 'express';
import { upload } from '#middleware';
import UserController from '#controller/admin/User';
import { isRequiresValidated, validateCreateCategory } from '#server/validator/category';

const router = express.Router();

const { getUser, createUser } = UserController;

router.get('/user', upload.none(), getUser);

router.post('/user', upload.none(), createUser);

// router.post('/category', upload.none(), createCategory);
// router.post('/category/:_id', upload.none(), updateCategory);

export default router;
