// const { Product, Category } = require('@model')
// const { successHandler, errHandler } = require('@response')
// const slugify = require('slugify')
import { MESSAGE } from '#server/constant/message'
import { ProductVariant, Product } from '#server/model'
import _ from 'lodash'
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
      let query = req.query
      let result = new Map()

      let parentItem = await Product.findOne({
        slug,
      })

      let parentId = parentItem._id

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
            description: '$description',
            content: '$content',
            slug: '$slug',
            type: '$type',
            price: '$child.price',
            regular_price: '$child.regular_price',
            attribute: '$child.attributes',
            primary: '$primary',
            // b: { $getField: { $literal: '$child.attributes.v' } },
          },
        },
        // {
        //   $group: {
        //     _id: '$_id',
        //     items: {
        //       $push: {
        //         _id: '$_id',
        //         title: '$title',
        //         description: '$description',
        //         content: '$content',
        //         slug: '$slug',
        //         type: '$type',
        //         attribute: '$attribute',
        //       },
        //     },
        //   },
        // },
        // {
        //   $unwind: '$attribute',
        // },
        // {
        //   $group: {
        //     _id: '$attribute.v',
        //     items: {
        //       $push: {
        //         _id: '$_id',
        //         title: '$title',
        //         description: '$description',
        //         content: '$content',
        //         slug: '$slug',
        //         type: '$type',
        //         attribute: '$attributes',
        //       },
        //     },
        //   },
        // },
        // {
        //   $project: {
        //     _id: '$_id',
        //     title: '$title',
        //     description: '$description',
        //     content: '$content',
        //     slug: '$slug',
        //     type: '$type',
        //     k: '$attribute.k',
        //     v: '$attribute.v',
        //   },
        // },

        // {
        //   $project: {
        //     _id: '$_id',
        //     title: '$title',
        //     description: '$description',
        //     content: '$content',
        //     slug: '$slug',
        //     type: '$type',
        //     a: '$attribute.k',
        //     v: '$attribute.v',
        //   },
        // },
        // {
        //   $unwind: '$attribute',
        // },
        // {
        //   $lookup: {
        //     from: 'productattributeterms',
        //     let: { attrId: '$attribute.v' },
        //     pipeline: [
        //       {
        //         $match: {
        //           _id: '$$attrId',
        //         },
        //       },
        //     ],
        //     as: 'attr',
        //   },
        // },
        // {
        //   $group: {
        //     _id: '$attribute.v',
        //     items: {
        //       $push: {
        //         _id: '$_id',
        //         title: '$title',
        //         description: '$description',
        //         content: '$content',
        //         slug: '$slug',
        //         type: '$type',
        //         attribute: '$attribute',
        //       },
        //     },
        //   },
        // },
        // {
        //   $lookup: {
        //     from: 'productattributeterms',
        //     localField: '_id',
        //     foreignField: '_id',
        //     as: 'child',
        //   },
        // },
        // {
        //   $group: `$child.attributes.${'$primary'}`,
        // },
      ])

      // let _prod = await ProductVariant.find({
      //   parentId: parentId,
      // })
      //   .populate({
      //     path: 'attributes',
      //   })
      //   .select('-createdAt -updatedAt  -__v')

      // let data = []

      // for (let prod of _prod) {
      //   if (prod._doc.attributes.length) {
      //     prod._doc.attributes = prod._doc.attributes.map((item) => {
      //       return {
      //         key: item?.parentId?.key,
      //         value: item?.name,
      //       }
      //     })
      //   }
      //   data.push(prod)
      // }

      // let newQuery
      // if (query) {
      //   newQuery = Object.keys(query).map((item) => ({ key: item, value: query[item] }))
      // }
      // for (let item of data) {
      //   let { attributes } = item
      //   if (attributes.length && newQuery.length) {
      //     let isExist = newQuery.every((q) => attributes.some((attr) => attr.key === q.key && q.value === attr.value))
      //     if (isExist) result.push(item)
      //   }
      // }

      // let newData = _.chain(data._doc).groupBy('attribute')

      //       for (const doc of data) {
      //         let primary = doc.primary

      //         if (!result.get(primary)) result.set(primary, {})
      //         else {
      //           let groupItems = result.get(primary) // [ { value, items}, ...]
      //           let done = false
      //           let val = []
      //           for (let groupItem of groupItems) {
      //             if (groupItem.value.includes(doc.attribute[primary])) {
      //               groupItem.items.push(doc)
      //               done = true
      //             }
      //             val.push(groupItem)
      //             if (done) break
      //           }

      //           if (!done) {
      //             let newVal = { value: doc.attribute[primary], items: [doc] }
      //             val.push(newVal)
      //           }

      //           console.log(val)
      //           // if (value === doc.attribute[primary]) {
      //           //   result.set(primary, [{ value, items: [...items, doc] }])
      //           // } else {
      //           // }
      //         }
      //         /**
      // result:
      // [
      //   {
      //     primary: xxx,
      //     item: []
      //   },
      //   {
      //     primary: yyy,
      //     item: []
      //   }
      // ]
      //  */
      //       }
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
          .map((value, key) => ({ value: key, primary: primaryKey, item: value }))
          .value(),
      })
    } catch (error) {
      console.log(error)
      return res.status(400).json({
        error,
      })
    }
  }

  findOneArray = (haystack, arr) => {
    return arr.some((v) => haystack.includes(v))
  }
}
