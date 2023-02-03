import { generateSeoTag } from '#common/helper'
import { Product, ProductCategory, ProductVariant } from '#server/model'
import _ from 'lodash'
import mongoose from 'mongoose'
import Response from '#server/response'

export default class ProductController {
  getProductSlug = async (req, res) => {
    try {
      let { slug } = req.params

      let parentItem = await Product.findOne({
        slug,
      })

      let _relationProd = await Product.aggregate([
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
            stock_status: '$child.stock_status',
            purchasable: '$child.purchasable',
          },
        },
      ])

      let primaryKey = parentItem.primary

      _relationProd = _relationProd
        .map((item) => {
          let obj = { ...item }
          for (let key in item.attribute) {
            obj[key] = item.attribute[key]
          }
          return obj
        })
        ?.filter((item) => item.purchasable)

      const seoTags = await generateSeoTag({
        title: parentItem.title,
        description: parentItem.description,
        keywords: parentItem.title,
        url: `${process.env.HOSTNAME}/product/${parentItem.slug}`,
        image: `${parentItem.image?.[0]?.src}`,
      })

      return new Response().fetched(
        {
          data: parentItem,
          seo: [seoTags.head, seoTags.body],
          _relationProd,
        },
        res,
      )
    } catch (error) {
      console.log(error)
      return new Response().error(error, res)
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
            image: '$image',
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
            image: '$image',
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
              image: '$image',
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
            image: '$_id.image',
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

      return new Response().fetched(
        {
          data: _cate,
        },
        res,
      )
    } catch (error) {
      console.log(error)
      return new Response().error(error, res)
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
      return new Response().fetched(
        {
          data: _prod,
        },
        res,
      )
    } catch (error) {
      console.log('getProductById', error)
      return new Response().error(error, res)
    }
  }

  getProduct = async (req, res) => {
    try {
      let { price, createdAt, feature, activePage, pageSize, maxPrice, stock_status, all, type } = req.query

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

      return new Response().fetched(
        {
          length: _prod.length,
          total: count,
          data: _prod,
        },
        res,
      )
    } catch (error) {
      console.log('getProduct', error)
      return new Response().error(error, res)
    }
  }

  filterProduct = async (req, res) => {
    try {
      const { slug, ...query } = req.query

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
      return new Response().fetched(
        {
          data: filteredData,
        },
        res,
      )
    } catch (error) {
      return new Response().fetched(
        {
          data: [],
        },
        res,
      )
    }
  }

  searchProduct = async (req, res) => {
    try {
      const title = new RegExp(req.body.title, 'i')

      const _data = await Product.find({
        title: { $regex: title },
      })
      const count = _data.length

      return new Response().fetched(
        {
          data: _data,
          count,
        },
        res,
      )
    } catch (error) {
      return new Response().error(error, res)
    }
  }

  getProductFeed = async (req, res) => {
    try {
      let _prod = []
      _prod = await ProductVariant.find({
        purchasable: true,
      })
        .populate({
          path: 'parentId',
          select: 'title image.src slug category -_id',
          populate: {
            path: 'category',
            select: 'name -_id',
          },
        })
        .select('price parentId stock_status attributes -_id')

      _prod = _prod
        // ?.filter(({ parentId }) => parentId.purchasable)
        ?.map(({ parentId, price, stock_status, attributes }, index) => {
          let { title, slug, image, category } = parentId

          for (let keys in attributes) {
            const currentAttribute = attributes[keys]
            if (!title.includes(currentAttribute)) title += ` - ${currentAttribute}`
          }

          return {
            name: title,
            url: process.env.HOST + '/product/' + slug,
            price,
            stock_status: stock_status === 'instock' ? 1 : 0,
            category: category?.map(({ name }) => name),
            imageUrls: image.map(({ src }) => process.env.API + src),
          }
        })

      return new Response().fetched(_prod, res, true)
    } catch (error) {
      console.log(error)
      return new Response().error(error, res)
    }
  }
}
