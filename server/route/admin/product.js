import express from 'express';
import { upload } from '#middleware';
import ProductController from '#controller/admin/Product';
// import { isRequiresValidated, validateCreatePost } from '#server/validator/post';

const router = express.Router();

// const { createPost, updatePost, getPost, getSinglePost } = ProductController;
const { getProducts, createProduct } = new ProductController();

router.get('/post', upload.none(), getProducts);

router.post('/post', upload.none(), createProduct);

// router.get('/post/:slug', upload.none(), getSinglePost);

// router.post('/post', upload.fields([{ name: 'postImg', maxCount: 1 }]),  createPost);

// router.post('/post/:_id', upload.fields([{ name: 'postImg', maxCount: 1 }]),  updatePost);

export default router;
