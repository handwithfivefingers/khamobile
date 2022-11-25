// const { Product, Category } = require('@model')
// const { successHandler, errHandler } = require('@response')
// const slugify = require('slugify')
import { MESSAGE } from '#server/constant/message'
import { ProductOption } from '#server/model'
export default class ProductController {
  getProducts = async (req, res) => {
    try {
      let _prod = await ProductOption.aggregate([
        {
          $lookup: {
            from: 'products',
            localField: 'parentId',
            foreignField: '_id',
            as: 'child',
          },
        },
        {
          $unwind: '$child',
        },
        {
          $project: {
            _id: '$_id',
            title: ['$child.title', '$primaryKey'],
            slug: '$slug',
            price: '$price',
          },
        },
      ])
      return res.status(200).json({
        message: MESSAGE.FETCHED(),
        data: _prod,
      })
    } catch (error) {
      console.log(error)

      return res.status(400).json({
        message: MESSAGE.ERROR_ADMIN('Sản phẩm'),
      })
    }
  }

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

  getProductBySlug = async (req, res) => {
    try {
      let _product = await ProductOption.findOne({ slug: req.params.slug })

      let parentId = _product.parentId

      let _relationProd = await ProductOption.aggregate([
        {
          $match: {
            parentId,
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'parentId',
            foreignField: '_id',
            as: 'child',
          },
        },
        {
          $unwind: '$child',
        },
        {
          $group: {
            _id: '$primaryKey',
            item: {
              $push: {
                _id: '$_id',
                title: '$child.title',
                primaryKey: '$primaryKey',
                price: '$price',
                variant: '$variant',
              },
            },
          },
        },

        {
          $project: {
            _id: '$_id',
            item: {
              $cond: {
                if: { $gt: [{ $size: '$item' }, 1] }, // length > 1
                then: {
                  $filter: {
                    input: '$item',
                    as: 'prod',
                    cond: {},
                  },
                },
                else: {
                  $filter: {
                    input: '$item',
                    as: 'prod',
                    cond: {
                      $ne: ['$$prod._id', _product._id],
                    },
                  },
                },
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ])

      let isValidRelation = _relationProd.some((item) => item.item?.length > 0) && _relationProd.length > 1

      return res.status(200).json({
        message: MESSAGE.FETCHED(),
        data: _product,
        _relationProd: isValidRelation ? _relationProd : [],
      })
    } catch (error) {
      console.log(error)

      return res.status(400).json({
        message: MESSAGE.ERROR_ADMIN('Sản phẩm'),
      })
    }
  }
}
