import express from "express";
import { upload } from "#middleware";
import ProductController from "#controller/admin/Product";
// import { isRequiresValidated, validateCreatePost } from '#server/validator/post';

const router = express.Router();

const { getProducts, createProduct, getProductBySlug, updateProduct } =
  new ProductController();

router.get("/product", upload.none(), getProducts);

router.post(
  "/product",
  upload.fields([{ name: "img", maxCount: 10 }]),
  createProduct
);

router.get("/product/:slug", upload.none(), getProductBySlug);

// router.post('/post', upload.fields([{ name: 'postImg', maxCount: 1 }]),  createPost);

router.post("/product/:_id", upload.fields([{ name: "img" }]), updateProduct);

export default router;
