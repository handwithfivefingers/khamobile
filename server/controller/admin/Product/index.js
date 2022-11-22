// const { Product, Category } = require('@model')
// const { successHandler, errHandler } = require('@response')
// const slugify = require('slugify')
import { Product } from "#server/model";
import { MESSAGE } from "#server/constant/message";
import slugify from "slugify";
import ProductModel from "./Model";
import shortid from "shortid";
import axios from "axios";
import PuppeteerController from "#server/controller/Service/Puppeteer";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
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

  test = async (req, res) => {
    try {
      // let { data } = await axios.get(
      //   "https://khamobile.vn/wp-json/wp/v2/product?per_page=100&page=1&_embed"
      // );
      // const baseImgPath = "https://khamobile.vn/wp-json/wp/v2/media/";

      // data = data.map((item) => {
      //   let featureImg = baseImgPath + item.featured_media;

      //   return {
      //     slug: item.slug,
      //     title: item.title.rendered,
      //     content: item.title.rendered,
      //     description: item.title.excerpt,

      //   };
      // });
      this.khaMobileCrawler();

      return res.status(200).json({
        message: "Starting browser",
      });
    } catch (error) {
      console.log("update product error", error);
      return res.status(400).json({ error });
    }
  };

  khaMobileCrawlerProductCategory = async () => {
    const {
      page,
      browser,
      status: isBrowserReady,
    } = await new PuppeteerController().startBrowser("https://khamobile.vn/");

    //id menu:  mega-menu-primary
    // li 3rd -> ul.mega-sub-menu
    //
    let selector = "#mega-menu-primary";

    if (!isBrowserReady) throw { message: "Browser was error" };

    await page.waitForSelector(selector);

    const text = await page.evaluate(() => {
      let list = [];
      let data = [];
      let megaMenu = document.getElementById("mega-menu-primary");

      if (!megaMenu) return "";

      let sanphamItem = megaMenu.querySelectorAll("li")[2];

      let listItemHasChildren = sanphamItem.querySelectorAll(
        ".mega-menu-item-has-children"
      );

      for (let item of listItemHasChildren) {
        // get list parent category
        list.push(item);
      }

      for (let subCate of list) {
        let subChild = subCate
          .querySelector(".mega-sub-menu")
          .querySelectorAll("a[href]");
        subChild = [...subChild].map((item) => item.href);

        data.push({
          category: subCate.querySelector("a").textContent,
          link: subChild,
        });
      }
      return data;
    });

    fs.writeFile(
      path.join(
        path.resolve(""),
        "uploads",
        "crawler",
        "product-category.json"
      ),
      JSON.stringify(text),
      "utf8",
      (error, data) => {
        if (error) console.log(error);
        if (data) console.log(data);
      }
    );

    browser.close();
  };

  // khaMobileCrawler = async () => {
  //   const data = JSON.parse(
  //     fs.readFileSync(
  //       path.join(
  //         path.resolve(""),
  //         "uploads",
  //         "crawler",
  //         "product-category.json"
  //       ),
  //       "utf8"
  //     )
  //   );
  //   console.log("data", data, typeof data);
  //   let result = [];
  //   for (let cate of data) {
  //     let dataCategory = {
  //       category: cate.category,
  //     };
  //     // console.log("cate", cate.href);

  //     let group = cate.href.map((item) => this.getProductLink(item));

  //     // console.log("group", group);

  //     const listPromise = await Promise.all(group);
  //     dataCategory = {
  //       ...dataCategory,
  //       data: listPromise,
  //     };
  //     result.push(dataCategory);
  //   }

  //   fs.writeFile(
  //     path.join(path.resolve(""), "uploads", "crawler", "product.json"),
  //     JSON.stringify(result),
  //     "utf8",
  //     (error, data) => {
  //       if (error) console.log(error);
  //       if (data) console.log(data);
  //     }
  //   );
  // };

  // getProductLink = async (url) => {
  //   let browser;
  //   try {
  //     const {
  //       page,
  //       browser: brows,
  //       status: isBrowserReady,
  //     } = await new PuppeteerController().startBrowser(url);
  //     browser = brows;
  //     // await page.waitForNavigation();

  //     if (!isBrowserReady) throw { message: "Browser was error" };

  //     let productItem =
  //       ".products .product-small.col .woocommerce-loop-product__link";
  //     const text = await page.evaluate((prodQuery) => {
  //       let data = [];
  //       let prods = document.querySelectorAll(prodQuery);
  //       let title = document.querySelector('h1.shop-page-title').innerText;

  //       for (let prod of prods) {
  //         data.push({
  //           href: prod.href,
  //         });
  //       }
  //       return { title, data };
  //     }, productItem);
  //     console.log(text);
  //     return text;
  //   } catch (error) {
  //     console.log(url, " : ", error);
  //   } finally {
  //     browser.close();
  //   }
  // };

  createMutipleProduct = async (req, res) => {
    try {
      const { title, description, content, variant } = req.body;
      var _id = new mongoose.Types.ObjectId();

      let _prod = new Product({
        _id,
        title,
        slug:
          slugify(title.toLowerCase().split(" ").join("-")) + "-" + shortid(),
        description,
        content,
        parent: 0,
        type: "variant",
      });

      await _prod.save();

      for (let item of variant) {
        let model = new Product({
          title: title + " " + item.primary_key,
          slug:
            slugify(
              (title + " " + item.primary_key)
                .toLowerCase()
                .split(" ")
                .join("-")
            ) +
            "-" +
            shortid(),
          description,
          content,
          parentId: _id,
          parent: 1,
          price: item.price,
          color: item.color,
          type: "variant",
        });
        await model.save();
      }

      return res.status(200).json({
        message: "ok",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        error,
      });
    }
  };
}
