// const { Product, Category } = require('@model')
// const { successHandler, errHandler } = require('@response')
// const slugify = require('slugify')
import { Product, ProductOption } from '#server/model'
import { MESSAGE } from '#server/constant/message'
import slugify from 'slugify'
import ProductModel from './Model'
import shortid from 'shortid'
import axios from 'axios'
import PuppeteerController from '#server/controller/Service/Puppeteer'
import fs from 'fs'
import path from 'path'
import mongoose, { startSession } from 'mongoose'
export default class ProductController {
  getProducts = async (req, res) => {
    try {
      let _product = await Product.find({})

      return res.status(200).json({
        message: MESSAGE.FETCHED(),
        data: _product,
      })
    } catch (error) {
      console.log(error)

      return res.status(400).json({
        message: MESSAGE.ERROR_ADMIN('Sản phẩm'),
      })
    }
  }

  createProduct = async (req, res) => {
    try {
      console.log(req.files)

      const obj = {
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        slug: req.body.slug + '-' + shortid(),
        category: req.body.category,
        type: req.body.type,
        primary_variant: req.body.primary_variant,
        primary_value: req.body.primary_value,
      }

      if (req.body.type === 'simple') {
        obj.price = req.body.price
      } else if (req.body.type === 'variant') {
        obj.variant = req.body.variant
      }

      if (req.files?.img) {
        obj.img = req.files?.img?.map((file) => ({
          src: '/public/' + file.filename,
        }))
      }

      const { ..._prodObject } = new ProductModel(obj)

      const _product = new Product(_prodObject)

      await _product.save()

      return res.status(200).json({
        message: MESSAGE.CREATED(),
        data: _product,
      })
    } catch (err) {
      console.log('createProduct error', err)

      return res.status(400).json({
        message: MESSAGE.ERROR_ADMIN('Sản phẩm'),
      })
    }
  }

  getProductBySlug = async (req, res) => {
    try {
      // let _product = await Product.aggregate({
      //   slug: req.params.slug,
      // });

      let _product = await Product.aggregate([
        {
          $match: {
            slug: req.params.slug,
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'parentId',
            as: 'child',
          },
        },
        {
          $unwind: '$child',
        },
        {
          $project: {
            // child: {
            //   $map: {
            //     input: "$child",
            //     as: "item",
            //     in: {
            //       title: "$$item.title",
            //       price: "$$item.price",
            //       slug: "$$item.slug",
            //     },
            //   },
            // },
            title: '$title',
            slug: '$slug',
            content: '$content',
            description: '$description',
            child: {
              title: '$child.title',
              price: '$child.price',
              slug: '$child.slug',
            },
          },
        },
      ])

      return res.status(200).json({
        message: MESSAGE.FETCHED(),
        data: _product,
      })
    } catch (error) {
      console.log(error)

      return res.status(400).json({
        message: MESSAGE.ERROR_ADMIN('Sản phẩm'),
      })
    }
  }

  updateProduct = async (req, res) => {
    try {
      const { _id } = req.params

      let objUpdate = {}
      console.log(req.body)

      Object.keys(req.body).forEach((key) => {
        if (key === 'img') {
          if (Array.isArray(req.body[key])) {
            objUpdate[key] = [...req.body[key].map((item) => ({ src: item }))]
          } else {
            objUpdate[key] = [{ src: req.body[key] }]
          }
        } else if (key === 'variable') {
          const parse = JSON.parse(req.body[key])
          objUpdate[key] = parse
        } else {
          objUpdate[key] = req.body[key]
        }
      })

      if (req.files?.img?.length > 0) {
        objUpdate.img = [
          ...objUpdate.img,
          ...req.files.img?.map((file) => ({
            src: '/public/' + file.filename,
          })),
        ]
      }
      const { ...obj } = new ProductModel(objUpdate)

      const _prod = await Product.updateOne({ _id: _id }, obj, { new: true })
      console.log(_prod)
      return res.status(200).json({
        message: 'update product',
        data: _prod,
      })
    } catch (error) {
      console.log('update product error', error)
      return res.status(400).json({ error })
    }
  }

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
      this.khaMobileCrawler()

      return res.status(200).json({
        message: 'Starting browser',
      })
    } catch (error) {
      console.log('update product error', error)
      return res.status(400).json({ error })
    }
  }

  khaMobileCrawlerProductCategory = async () => {
    const {
      page,
      browser,
      status: isBrowserReady,
    } = await new PuppeteerController().startBrowser('https://khamobile.vn/')

    //id menu:  mega-menu-primary
    // li 3rd -> ul.mega-sub-menu
    //
    let selector = '#mega-menu-primary'

    if (!isBrowserReady) throw { message: 'Browser was error' }

    await page.waitForSelector(selector)

    const text = await page.evaluate(() => {
      let list = []
      let data = []
      let megaMenu = document.getElementById('mega-menu-primary')

      if (!megaMenu) return ''

      let sanphamItem = megaMenu.querySelectorAll('li')[2]

      let listItemHasChildren = sanphamItem.querySelectorAll('.mega-menu-item-has-children')

      for (let item of listItemHasChildren) {
        // get list parent category
        list.push(item)
      }

      for (let subCate of list) {
        let subChild = subCate.querySelector('.mega-sub-menu').querySelectorAll('a[href]')
        subChild = [...subChild].map((item) => item.href)

        data.push({
          category: subCate.querySelector('a').textContent,
          link: subChild,
        })
      }
      return data
    })

    fs.writeFile(
      path.join(path.resolve(''), 'uploads', 'crawler', 'product-category.json'),
      JSON.stringify(text),
      'utf8',
      (error, data) => {
        if (error) console.log(error)
        if (data) console.log(data)
      },
    )

    browser.close()
  }

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
    const session = await startSession()
    try {
      const { title, description, content, variant, keyVariant, price } = req.body

      session.startTransaction()

      const _id = new mongoose.Types.ObjectId()

      let _prod = {
        _id,
        title,
        slug: slugify(title.toLowerCase().split(' ').join('-')) + '-' + shortid(),
        description,
        content,
      }

      if (variant.length > 0) {
        let spec = variant.reduce(
          (prev, current) => {
            prev.k = current?.k
            prev.v = [...prev.v, current?.v]
            return prev
          },
          { k: '', v: [] },
        )
        _prod.spec = spec
        _prod.keyVariant = keyVariant
      }

      let _model = new Product(_prod)

      await Product.create([_model], { session })
      // await _model.save()

      for (let _var of variant) {
        for (let item of _var?.items) {
          await this.createProductOption({ parentId: _id, variant: item, primaryKey: _var.v })
        }
      }
      // create product Option

      // -> done
      await session.commitTransaction()

      return res.status(200).json({
        message: 'ok',
      })
    } catch (error) {
      console.log(error)
      await session.abortTransaction()
      return res.status(400).json({
        error,
      })
    } finally {
      session.endSession()
    }
  }

  /**
   *
   * @param {*} parentId
   * @param { *__key : value, price }  variant
   */
  createProductOption = async ({ parentId, variant, primaryKey }) => {
    try {
      let _product = {
        parentId,
        primaryKey,
      }
      console.log(variant)

      if (variant) {
        let { price, ...variable } = variant

        _product.variant = { ...variable }
        _product.price = price
      }
      let _model = new ProductOption(_product)
      await _model.save()
    } catch (error) {
      console.log('create error', error)
    }
  }

  getVariantProduct = async (req, res) => {
    try {
      let { primary } = req.query
      const pipe = [
        {
          $match: {
            slug: req.params.slug,
          },
        },
        {
          $lookup: {
            from: 'productoptions',
            localField: '_id',
            foreignField: 'parentId',
            as: 'child',
          },
        },

        {
          $project: {
            title: '$title',
            slug: '$slug',
            content: '$content',
            description: '$description',
            keyVariant: '$keyVariant',
            k: '$spec.k',
            v: '$spec.v',
            child: {
              $cond: {
                if: { $gt: [{ $size: '$child' }, 1] }, // length >1 1
                then: {
                  $filter: {
                    input: '$child',
                    as: 'item',
                    cond: {},
                  },
                },
                else: {
                  price: { $sum: '$child.price' }, // length <= 1
                },
              },
            },
          },
        },
        {
          $unwind: '$child',
        },
      ]
      if (primary) {
        pipe.push(
          {
            $match: {
              'child.primaryKey': primary,
            },
          },
        )
      }
      let _product = await Product.aggregate(pipe)

      return res.status(200).json({
        message: MESSAGE.FETCHED(),
        data: _product,
      })
    } catch (error) {
      console.log(error)

      return res.status(400).json({
        message: MESSAGE.ERROR_ADMIN('Sản phẩm'),
      })
    }
  }

  getAllProduct = async (req, res) => {
    try {
      let _product = await Product.aggregate([
        // {
        //   $match: {
        //     slug: req.params.slug,
        //   },
        // },
        {
          $lookup: {
            from: 'productoptions',
            localField: '_id',
            foreignField: 'parentId',
            as: 'child',
          },
        },
        {
          $unwind: '$child',
        },
        {
          $project: {
            title: [`$title`, `$child.primaryKey`],
            slug: '$slug',
            content: '$content',
            description: '$description',
            k: '$spec.k',
            variant: '$child.variant',
            primaryKey: '$child.primaryKey',
            price: '$child.price',
          },
        },
        // {
        //   $unwind: '$child',
        // },
      ])

      return res.status(200).json({
        message: MESSAGE.FETCHED(),
        data: _product,
      })
    } catch (error) {
      console.log(error)

      return res.status(400).json({
        message: MESSAGE.ERROR_ADMIN('Sản phẩm'),
      })
    }
  }
}

/**
 * product -> 3 variant 
  v_1 {
    title: iphone 14,
    variant: {
      color: red,
      size: 12,
      version: VN
    },
    price: 20
  }

  v_2 {
    title: iphone 14,
    variant: {
      color:blue,
      size:11,
      version:VN
    }
    price:18
  }
  v_3 {
    title: iphone 14,
    variant: { 
      color:blue,
      size:12,
      version:CN
    }
    price:19
  }

  =>

  {
    title: iphone 14,
    variant: [
      {
        key: size,
        value: 12,
        item: [
          {
            color:blue,
            version:CN,
            price:12
          },
          {
            color: red,
            version:VN,
            price: 20
          }
        ]
      },
      {
        key: size
        value: 11,
         item: [
          {
            color:blue,
            version:VN,
            price:11
          },
        ]
      }
    ]
  }

  =>

  product_1 {
    title: iphone 14
    spec: {
      k: size,
      v: [11,12]
    },
    keyVariant: ['','',]
    id: 1,
  }


  productOption_1 {
    color:blue,
    version:CN,
    price:12,
    parentId:1,
    size:12,
    id:1,
  }

  productOption_2 {
    color:red,
    version:VN,
    price:20,
    parentId:1,
    size:12,
    id:2,
  }

  productOption_3 {
    color:blue,
    version:VN,
    price:11,
    parentId:1,
    size:11,
    id:3,
  }

  => api product details 
  - => title:  iphone 14
  - => sku:  [size : 11 * Selected] [size: 12] => clicked -> call api -> 
  - => variant: [product Option Id: 1 * Selected] [product Option Id: 2] [product Option Id: 3]
*/
