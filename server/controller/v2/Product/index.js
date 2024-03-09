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
      }).select('_id title attributes content description information image type price regular_price stock_status')

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
            pipeline: [
              {
                $match: {
                  purchasable: true,
                },
              },
            ],
          },
        },
        {
          $unwind: '$child',
        },
        {
          $project: {
            _id: '$child._id',
            // parentId: '$_id',
            // title: '$title',
            // slug: '$slug',
            // type: '$type',
            price: '$child.price',
            regular_price: '$child.regular_price',
            attribute: '$child.attributes',
            // primary: '$primary',
            stock_status: '$child.stock_status',
            // purchasable: '$child.purchasable',
            image: '$child.image',
          },
        },
      ])
      _relationProd = _relationProd.map((item) => {
        let obj = { ...item }
        for (let key in item.attribute) {
          obj[key] = item.attribute[key]
        }
        return obj
      })
      // ?.filter((item) => item.purchasable)

      if (parentItem.content) {
        const resultConvert = this.formatWP_URLToCurrentHost(parentItem.content, parentItem.description)
        parentItem.content = resultConvert.content
        parentItem.description = resultConvert.description
      }

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
                purchasable: true
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
      let sortPipe = []

      if (price) {
        sortPipe.push(['price', price])
      }
      if (createdAt) {
        sortPipe.push(['createdAt', createdAt])
      }

      if (all) {
        _prod = await Product.find().select('-content -createdAt -updatedAt -__v')
      } else {
        if (price || createdAt) {
          _prod = await Product.find({
            price: {
              $lt: MAXPRICE,
            },
          })
            .select('-content -_id -createdAt -updatedAt -__v')
            .sort(sortPipe)
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
            .sort(sortPipe)
            .skip(activeP * pageS - pageS)
            .limit(pageS)
          count = await Product.find({
            price: {
              $lt: MAXPRICE,
            },
          }).count()
        }
      }

      // _prod.sort((a, b) => b.price - a.price)

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

      let simpleProd = await Product.find({ type: 'simple' })
        .populate({
          path: 'category',
          select: 'name -_id',
        })
        .select('title slug price stock_status category image')

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

      _prod = _prod?.map(({ parentId, price, stock_status, attributes }, index) => {
        let { title, slug, image, category } = parentId

        for (let keys in attributes) {
          const currentAttribute = attributes[keys]
          if (!title.includes(currentAttribute)) title += ` - ${currentAttribute}`
        }

        return {
          name: title,
          url: process.env.HOST + '/product/' + slug,
          price,
          instock: stock_status === 'instock' ? 1 : 0,
          category: category?.map(({ name }) => name),
          imageUrls: image.map(({ src }) => process.env.API + src),
        }
      })

      simpleProd = simpleProd?.map(({ _doc }, index) => {
        let { title: name, slug, image, category, stock_status, price } = _doc
        console.log(category)
        return {
          name,
          url: process.env.HOST + '/product/' + slug,
          price,
          instock: stock_status === 'instock' ? 1 : 0,
          category: category?.map(({ name }) => name),
          imageUrls: image.map(({ src }) => process.env.API + src),
        }
      })
      return new Response().fetched([...simpleProd, ..._prod], res, true)
    } catch (error) {
      console.log(error)
      return new Response().error(error, res)
    }
  }

  formatWP_URLToCurrentHost = (content, description) => {
    try {
      const result = {
        content: content,
        description: description,
      }
      const pathImg = `${
        process.env.NODE_ENV !== 'development' ? process.env.API : 'https://app.khamobile.vn'
      }/public/wp/`

      if (content?.match(/https:\/\/khamobile.vn\/wp-content\/uploads\//g)) {
        result.content = content?.replace(/https:\/\/khamobile.vn\/wp-content\/uploads\//g, pathImg)

        result.description = description?.replace(/https:\/\/khamobile.vn\/wp-content\/uploads\//g, pathImg)
      }
      return result
    } catch (error) {
      console.log(error)
      return { content, description }
    }
  }
}
