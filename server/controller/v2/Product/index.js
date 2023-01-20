import { generateSeoTag } from '#common/helper'
import { Product, ProductCategory } from '#server/model'
import _ from 'lodash'
import mongoose from 'mongoose'

export default class ProductController {
  getProductSlug = async (req, res) => {
    try {
      let { slug } = req.params

      let parentItem = await Product.findOne({
        slug,
      })

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

      const seoTags = await generateSeoTag({
        title: parentItem.title,
        description: parentItem.description,
        keywords: parentItem.title,
        url: `${process.env.HOSTNAME}/product/${parentItem.slug}`,
        image: `${parentItem.image?.[0]?.src}`,
      })

      console.log(data)

      return res.status(200).json({
        data: parentItem,
        seo: [seoTags.head, seoTags.body],
        _relationProd: data,
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
        {
          $unwind: '$child',
        },
        {
          $group: {
            _id: {
              _id: '$_id',
              name: '$name',
              slug: '$slug',
            },
            child: {
              $push: {
                title: '$child.title',
                price: '$child.price',
                description: '$child.description',
                slug: '$child.slug',
                category: '$child.category',
                image: '$child.image',
                type: '$child.type',
                _id: '$child._id',
              },
            },
          },
        },
        {
          $project: {
            _id: '$_id._id',
            name: '$_id.name',
            slug: '$_id.slug',
            child: '$child',
          },
        },
        {
          $lookup: {
            from: 'productcategories',
            localField: '_id',
            foreignField: 'parent',
            pipeline: [
              {
                $limit: 4,
              },
              {
                $project: {
                  _id: '$_id',
                  name: '$name',
                  slug: '$slug',
                },
              },
            ],
            as: 'categories',
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
              attributes: '$variants.attributes',
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
      let { price, createdAt, feature, activePage, pageSize, maxPrice, stock_status, all } = req.query

      let pageS = pageSize || 10

      let activeP = (activePage > 0 && activePage) || 1

      let _prod

      const UNIT_PRICE = 1000000

      const MAXPRICE = Number(maxPrice) * UNIT_PRICE || 999 * UNIT_PRICE

      let count
      if (all) {
        _prod = await Product.find().select('-content -_id -createdAt -updatedAt -__v')
      } else {
        if (price || createdAt) {
          _prod = await Product.find({
            price: {
              $lt: MAXPRICE,
            },
          })
            .select('-content -_id -createdAt -updatedAt -__v')
            .sort([
              ['price', price || 1],
              ['createdAt', createdAt || 1],
            ])
            .skip(activeP * pageS - pageS)
            .limit(pageS)

          count = await Product.find({
            price: {
              $lt: MAXPRICE,
            },
          }).count()
        } else {
          _prod = await Product.find({
            price: {
              $lt: MAXPRICE,
            },
          })
            .select('-content -_id -createdAt -updatedAt -__v')
            .skip(activeP * pageS - pageS)
            .limit(pageS)
          count = await Product.find({
            price: {
              $lt: MAXPRICE,
            },
          }).count()
        }
      }

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

  searchProduct = async (req, res) => {
    try {
      const title = new RegExp(req.body.title, 'i')

      const _data = await Product.find({
        title: { $regex: title },
      })
      const count = _data.length
      return res.status(200).json({
        data: _data,
        count,
      })
    } catch (error) {
      return res.status(400).json({
        error,
      })
    }
  }
}
