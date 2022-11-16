// const { Product, Category } = require('@model')
// const { successHandler, errHandler } = require('@response')
// const slugify = require('slugify')
import { Product } from "#server/model";
import { MESSAGE } from "#server/constant/message";
import slugify from "slugify";
import ProductModel from "./Model";
import shortid from "shortid";

export default class ProductController {
  getProducts = async (req, res) => {
    try {
      let _product = await Product.find({});

      return res.status(200).json({
        message: MESSAGE.FETCHED(),
        data: _product,
      });
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        message: MESSAGE.ERROR_ADMIN("Sản phẩm"),
      });
    }
  };

  createProduct = async (req, res) => {
    try {
      console.log(req.files);

      const obj = {
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        slug: req.body.slug + "-" + shortid(),
        category: req.body.category,
        type: req.body.type,
        primary_variant: req.body.primary_variant,
        primary_value: req.body.primary_value,
      };

      if (req.body.type === "simple") {
        obj.price = req.body.price;
      } else if (req.body.type === "variant") {
        obj.variant = req.body.variant;
      }

      if (req.files?.img) {
        obj.img = req.files?.img?.map((file) => ({
          src: "/public/" + file.filename,
        }));
      }

      const { ..._prodObject } = new ProductModel(obj);

      const _product = new Product(_prodObject);

      await _product.save();

      return res.status(200).json({
        message: MESSAGE.CREATED(),
        data: _product,
      });
    } catch (err) {
      console.log("createProduct error", err);

      return res.status(400).json({
        message: MESSAGE.ERROR_ADMIN("Sản phẩm"),
      });
    }
  };

  getProductBySlug = async (req, res) => {
    try {
      let _product = await Product.findOne({
        slug: req.params.slug,
      });

      return res.status(200).json({
        message: MESSAGE.FETCHED(),
        data: _product,
      });
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        message: MESSAGE.ERROR_ADMIN("Sản phẩm"),
      });
    }
  };

  updateProduct = async (req, res) => {
    try {
      const { _id } = req.params;

      let objUpdate = {};
      console.log(req.body);

      Object.keys(req.body).forEach((key) => {
        if (key === "img") {
          if (Array.isArray(req.body[key])) {
            objUpdate[key] = [...req.body[key].map((item) => ({ src: item }))];
          } else {
            objUpdate[key] = [{ src: req.body[key] }];
          }
        } else if (key === "variable") {
          const parse = JSON.parse(req.body[key]);
          objUpdate[key] = parse;
        } else {
          objUpdate[key] = req.body[key];
        }
      });

      if (req.files?.img?.length > 0) {
        objUpdate.img = [
          ...objUpdate.img,
          ...req.files.img?.map((file) => ({
            src: "/public/" + file.filename,
          })),
        ];
      }
      const { ...obj } = new ProductModel(objUpdate);

      const _prod = await Product.updateOne({ _id: _id }, obj, { new: true });
      console.log(_prod);
      return res.status(200).json({
        message: "update product",
        data: _prod,
      });
    } catch (error) {
      console.log("update product error", error);
      return res.status(400).json({ error });
    }
  };

  // getProducts = async (req, res) => {
  //   try {

  //     let _product = await Product.find({}).populate('categories')

  //     return successHandler(_product, res)

  //   } catch (error) {
  //     console.log(error)
  //     return errHandler(error, res)
  //   }
  // }

  // getSingleProduct = async (req, res) => {
  //   try {
  //   } catch (error) {}
  // }

  // updateProduct = async (req, res) => {
  //   try {
  //     let { _id } = req.params

  //     let { categories, name, price, type } = req.body

  //     // if (!categories) throw { message: 'No categories provided' }

  //     let _update = {
  //       name,
  //       price,
  //       type,
  //       categories,
  //     }

  //     await Product.updateOne({ _id }, _update, { new: true })

  //     return res.status(200).json({
  //       message: ' ok',
  //     })
  //   } catch (error) {
  //     console.log(error)
  //     return errHandler(error, res)
  //   }
  // }

  // deleteProduct = async (req, res) => {
  //   try {
  //     const { _id } = req.params

  //     // return;
  //     await Product.findOneAndDelete({
  //       _id,
  //     })

  //     return res.status(200).json({ message: 'Xóa sản phẩm thành công', status: 200 })
  //   } catch (err) {
  //     console.log('deleteProduct error')

  //     return errHandler(err, res)
  //   }
  // }

  // filterProductCate = (cate) => {
  //   let res = []

  //   res = cate.reduce((result, current) => {
  //     let [parent, child] = current

  //     if (child) {
  //       let index = result.findIndex((item) => item._id === parent)

  //       if (index !== -1) {
  //         result[index].child = [...result[index].child, { _id: child }]
  //       } else {
  //         result = [...result, { _id: parent, child: [{ _id: child }] }]
  //       }
  //     } else {
  //       result = [...result, { _id: parent }]
  //     }

  //     return [...result]
  //   }, [])

  //   return res
  // }
}
