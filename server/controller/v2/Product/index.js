// const { Product, Category } = require('@model')
// const { successHandler, errHandler } = require('@response')
// const slugify = require('slugify')
import { MESSAGE } from '#server/constant/message'
import { ProductVariant, Product, ProductCategory } from '#server/model'
import _ from 'lodash'
import mongoose from 'mongoose'
export default class ProductController {
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
              image: { $first: '$image' },
            },
          },
        )
      } else {
        pipe.push({
          $project: {
            _id: '$_id',
            title: '$title',
            price: '$price',
            image: { $first: '$image' },
          },
        })
      }

      let [_prod] = await Product.aggregate(pipe)

      return res.status(200).json({
        data: _prod,
      })
    } catch (error) {
      console.log('getProductById', error)
      return res.status(400).json({
        error,
      })
    }
  }

  getProduct = async (req, res) => {
    try {
      let { price, createdAt, feature, activePage, pageSize } = req.query

      let pageS = pageSize || 10
      let activeP = (activePage > 0 && activePage) || 1
      let _prod

      if (price || createdAt) {
        _prod = await Product.find({})
          .sort([
            ['price', price || 1],
            ['createdAt', createdAt || 1],
          ])
          .skip(activeP * pageS - pageS)
          .limit(pageS)
      } else {
        _prod = await Product.find({})
          .skip(activeP * pageS - pageS)
          .limit(pageS)
      }
      const count = await Product.find({}).count()

      return res.status(200).json({
        length: _prod.length,
        total: count,
        data: _prod,
      })
    } catch (error) {
      console.log('getProduct', error)
      return res.status(400).json({
        error,
      })
    }
  }

  filterProduct = async (req, res) => {
    try {
      const { slug, ...query } = req.query

      // console.log(query)

      const pipeFilter = await Product.aggregate([
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

      const filteredData = []

      for (let i = 0; i < pipeFilter.length; i++) {
        const item = pipeFilter[i]
        const itemAttributes = item.attribute
        const isMatch = Object.keys(query).every((key) => itemAttributes[key] === query[key])
        if (isMatch) filteredData.push(item)
      }

      return res.status(200).json({
        data: filteredData,
      })
    } catch (error) {
      return res.status(200).json({
        data: [],
      })
    }
  }
}
