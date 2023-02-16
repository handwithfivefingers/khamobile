import { ProductCategory } from '#model'
import { generateSeoTag } from '#common/helper'
import Response from '#server/response'

export default class ProductCategoryController {
  getCategory = async (req, res) => {
    try {
      let { all } = req.query

      let _category
      if (all) {
        _category = await ProductCategory.aggregate([
          {
            $project: {
              _id: '$_id',
              name: '$name',
              slug: '$slug',
              parent: '$parent',
              image: '$image',
              description: '$description',
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
        ])
      } else {
        _category = await ProductCategory.aggregate([
          {
            $project: {
              _id: '$_id',
              name: '$name',
              slug: '$slug',
              parent: '$parent',
              image: '$image',
              description: '$description',
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
        ])

        _category = _category.filter((item) => item.child.length)
      }

      return new Response().fetched({ data: _category }, res)
    } catch (error) {
      return new Response().error(error, res)
    }
  }

  createCategory = async (req, res) => {
    try {
      return new Response().created({}, res)
    } catch (error) {
      console.log('this.createCategory error: ' + error)

      return new Response().error(error, res)
    }
  }

  getCategoryBySlug = async (req, res) => {
    try {
      let { slug } = req.params

      let { price, createdAt, maxPrice } = req.query

      const UNIT_PRICE = 1000000

      // const MAXPRICE = Number(maxPrice) * UNIT_PRICE || 999 * UNIT_PRICE

      const _cate = await ProductCategory.findOne({
        slug: slug,
      }).select('name slug description image')

      const pipeAggregate = [
        {
          $match: {
            slug,
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'category',
            as: 'child',
          },
        },
        {
          $unwind: '$child',
        },
        {
          $sort: {
            title: -1,
            price: +price || -1,
            createdAt: +createdAt || -1,
          },
        },
        // {
        //   $match: {
        //     price: {
        //       $lt: MAXPRICE,
        //     },
        //   },
        // },
      ]

      pipeAggregate.push(
        {
          $project: {
            name: '$name',
            slug: '$slug',
            description: '$description',
            image: '$image',
            'child.title': '$child.title',
            'child.description': '$child.description',
            'child.price': '$child.price',
            'child.slug': '$child.slug',
            'child.category': '$child.category',
            'child.stock_status': '$child.stock_status',
            'child.type': '$child.type',
            'child.image': '$child.image',
            'child.attributes': '$child.attributes',
          },
        },

        {
          $group: {
            _id: null,
            items: {
              $push: {
                title: '$child.title',
                description: '$child.description',
                price: '$child.price',
                slug: '$child.slug',
                category: '$child.category',
                stock_status: '$child.stock_status',
                type: '$child.type',
                image: '$child.image',
                attributes: '$child.attributes',
              },
            },
          },
        },
      )

      let [_cateProd] = await ProductCategory.aggregate(pipeAggregate)

      let sortMemory = req.query['Dung lượng']

      if (sortMemory) {
        _cateProd?.items?.sort((a, b) => {
          if (sortMemory == 1) {
            if (a.title.toLowerCase().includes('1tb') && b.title.toLowerCase().includes('1tb')) return 1
            if (a.title.toLowerCase().includes('1tb')) return 1
            if (b.title.toLowerCase().includes('1tb')) return -1
            return a.title.toLowerCase().localeCompare(b.title.toLowerCase())
          } else if (sortMemory == -1) {
            if (b.title.toLowerCase().includes('1tb') && a.title.toLowerCase().includes('1tb')) return 0
            if (b.title.toLowerCase().includes('1tb')) return 1
            if (a.title.toLowerCase().includes('1tb')) return -1
            return b.title.toLowerCase().localeCompare(a.title.toLowerCase())
          }
        })
      }

      if (price) {
        _cateProd?.items?.sort((a, b) => {
          if (price == -1) {
            return b.price - a.price
          }
          if (price == 1) {
            return a.price - b.price
          }
        })
      }

      return new Response().fetched(
        {
          data: { cate: _cate, product: _cateProd },
        },
        res,
      )
    } catch (error) {
      console.log('this.getCategoryBySlug error: ' + error)
      return new Response().error(error, res)
    }
  }
}
