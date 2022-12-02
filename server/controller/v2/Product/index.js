// const { Product, Category } = require('@model')
// const { successHandler, errHandler } = require('@response')
// const slugify = require('slugify')
import { MESSAGE } from '#server/constant/message'
import { ProductVariant, Product, ProductCategory } from '#server/model'
import _ from 'lodash'
import mongoose from 'mongoose'
export default class ProductController {
  // getProducts = async (req, res) => {
  //   try {
  //     let _prod = await ProductOption.aggregate([
  //       {
  //         $lookup: {
  //           from: 'products',
  //           localField: 'parentId',
  //           foreignField: '_id',
  //           as: 'child',
  //         },
  //       },
  //       {
  //         $unwind: '$child',
  //       },
  //       {
  //         $project: {
  //           _id: '$_id',
  //           title: ['$child.title', '$primaryKey'],
  //           slug: '$slug',
  //           price: '$price',
  //         },
  //       },
  //     ])
  //     return res.status(200).json({
  //       message: MESSAGE.FETCHED(),
  //       data: _prod,
  //     })
  //   } catch (error) {
  //     console.log(error)

  //     return res.status(400).json({
  //       message: MESSAGE.ERROR_ADMIN('Sản phẩm'),
  //     })
  //   }
  // }

  // getProductBySlug = async (req, res) => {
  //   try {
  //     let _product = await ProductOption.findOne({ slug: req.params.slug })

  //     let parentId = _product.parentId

  //     let _prod = await ProductOption.find({ parentId: parentId }).populate({ path: 'parentId', select: 'spec.k' })

  //     let formatProd = []

  //     for (let item of _prod) {
  //       let obj = {
  //         _id: item._id,
  //         k: item.parentId.spec?.k,
  //         v: item.primaryKey,
  //         price: item.price,
  //         slug: item.slug,
  //       }
  //       if (item.variant.length > 0) {
  //         for (let _var in item.variant) {
  //           const value = item.variant[_var]
  //           obj[_var] = value
  //         }
  //       }
  //       formatProd.push(obj)
  //     }
  //     return res.status(200).json({
  //       message: MESSAGE.FETCHED(),
  //       data: _product,
  //       variable: formatProd,
  //     })
  //   } catch (error) {
  //     console.log(error)
  //     return res.status(400).json({
  //       message: MESSAGE.ERROR_ADMIN('Sản phẩm'),
  //     })
  //   }
  // }

  // getProductBySlug = async (req, res) => {
  //   try {
  //     let _product = await ProductOption.findOne({ slug: req.params.slug })
  //       .select('-createdAt -updatedAt -__v')
  //       .populate({
  //         path: 'parentId',
  //         select: '_id img',
  //       })

  //     let parentId = _product.parentId

  //     let _relationProd = await ProductOption.aggregate([
  //       {
  //         $match: {
  //           parentId,
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: 'products',
  //           localField: 'parentId',
  //           foreignField: '_id',
  //           as: 'child',
  //         },
  //       },
  //       {
  //         $unwind: '$child',
  //       },
  //       {
  //         $group: {
  //           _id: '$primaryKey',
  //           item: {
  //             $push: {
  //               _id: '$_id',
  //               title: '$child.title',
  //               primaryKey: '$primaryKey',
  //               price: '$price',
  //               variant: '$variant',
  //             },
  //           },
  //         },
  //       },

  //       {
  //         $project: {
  //           _id: '$_id',
  //           item: {
  //             $cond: {
  //               if: { $gt: [{ $size: '$item' }, 1] }, // length > 1
  //               then: {
  //                 $filter: {
  //                   input: '$item',
  //                   as: 'prod',
  //                   cond: {},
  //                 },
  //               },
  //               else: {
  //                 $filter: {
  //                   input: '$item',
  //                   as: 'prod',
  //                   cond: {
  //                     $ne: ['$$prod._id', _product._id],
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //       { $sort: { _id: 1 } },
  //     ])

  //     let isValidRelation = _relationProd.some((item) => item.item?.length > 0) && _relationProd.length > 1

  //     return res.status(200).json({
  //       message: MESSAGE.FETCHED(),
  //       data: _product,
  //       _relationProd: isValidRelation ? _relationProd : [],
  //     })
  //   } catch (error) {
  //     console.log(error)

  //     return res.status(400).json({
  //       message: MESSAGE.ERROR_ADMIN('Sản phẩm'),
  //     })
  //   }
  // }

  getProductSlug = async (req, res) => {
    try {
      let { slug } = req.params

      let parentItem = await Product.findOne({
        slug,
      })

      // let parentId = parentItem._id

      let data = await Product.aggregate([
        {
          $match: {
            slug,
          },
        },
        {
          $lookup: {
            from: 'productvariants',
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
            _id: '$child._id',
            parentId: '$_id',
            title: '$title',
            slug: '$slug',
            type: '$type',
            price: '$child.price',
            regular_price: '$child.regular_price',
            attribute: '$child.attributes',
            primary: '$primary',
          },
        },
      ])

      let primaryKey = parentItem.primary

      data = data.map((item) => {
        let obj = { ...item }
        for (let key in item.attribute) {
          obj[key] = item.attribute[key]
        }
        return obj
      })

      return res.status(200).json({
        data: parentItem,
        _relationProd: _.chain(data)
          .groupBy(primaryKey)
          .map((value, key) => {
            if (primaryKey) {
              return { value: key, primary: primaryKey, item: value }
            }
            return { item: value }
          })
          .value(),
      })
    } catch (error) {
      console.log(error)
      return res.status(400).json({
        error,
      })
    }
  }

  getHomeProduct = async (req, res) => {
    try {
      let _prod
      let _cate = await ProductCategory.aggregate([
        {
          $project: {
            _id: '$_id',
            name: '$name',
            slug: '$slug',
            parent: '$parent',
          },
        },
        {
          $lookup: {
            from: 'productcategories',
            localField: '_id',
            foreignField: 'parent',
            as: 'child',
          },
        },
        {
          $match: {
            'child.1': { $exists: true },
          },
        },
        {
          $project: {
            _id: '$_id',
            name: '$name',
            slug: '$slug',
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'category',
            pipeline: [
              {
                $limit: 6,
              },
            ],
            as: 'child',
          },
        },
      ])

      return res.status(200).json({
        data: _cate,
      })
    } catch (error) {
      console.log(error)
      return res.status(400).json({
        error,
      })
    }
  }

  getProductById = async (req, res) => {
    try {
      let { _id, variantId } = req.body

      const pipe = [
        {
          $match: {
            _id: mongoose.Types.ObjectId(_id),
          },
        },
      ]

      if (variantId) {
        pipe.push(
          {
            $lookup: {
              from: 'productvariants',
              localField: '_id',
              foreignField: 'parentId',
              as: 'variants',
            },
          },
          {
            $unwind: '$variants',
          },
          {
            $match: {
              'variants._id': mongoose.Types.ObjectId(variantId),
            },
          },
          {
            $project: {
              _id: '$_id',
              title: '$title',
              variantId: '$variants._id',
              price: '$variants.price',
              img: '$img',
            },
          },
        )
      } else {
        pipe.push({
          $project: {
            _id: '$_id',
            title: '$title',
            price: '$price',
            img: '$img',
          },
        })
      }

      let [_prod] = await Product.aggregate(pipe)

      return res.status(200).json({
        data: _prod,
      })
    } catch (error) {
      console.log('getProduct', error)
      return res.status(400).json({
        error,
      })
    }
  }

  getProduct = async (req, res) => {
    try {
      let { price, createdAt, feature } = req.query
      let _prod
      if (price || createdAt) {
        _prod = await Product.find({}).sort([
          ['price', price || 1],
          ['createdAt', createdAt || 1],
        ])
      } else {
        _prod = await Product.find({})
      }

      return res.status(200).json({
        data: _prod,
      })
    } catch (error) {
      console.log('getProduct', error)
      return res.status(400).json({
        error,
      })
    }
  }
}
