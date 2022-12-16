import { ProductCategory } from '#model'
import { generateSeoTag } from '#common/helper'

export default class ProductCategoryController {
  getCategory = async (req, res) => {
    try {
      let { type } = req.query
      let _category

      _category = await ProductCategory.aggregate([
        {
          $project: {
            _id: '$_id',
            name: '$name',
            slug: '$slug',
            parent: '$parent',
            image: '$image',
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
        // {
        //   $project: {
        //     _id: '$_id',
        //     name: '$name',
        //     slug: '$slug',
        //     child: {
        //       _id: '$child._id',
        //       name: '$child.name',
        //       slug: '$child.slug',
        //     },
        //   },
        // },
        // {
        //   $group: {
        //     _id: '$parent',
        //     item: {
        //       $push: {
        //         id: '$_id',
        //         name: '$name',
        //         slug: '$slug',
        //       },
        //     },
        //   },
        // },
      ])

      _category = _category.filter((item) => item.child.length)

      // console.log(_category)

      return res.status(200).json({
        data: _category,
      })
    } catch (error) {
      return res.status(400)
    }
  }

  createCategory = async (req, res) => {
    try {
      return res.status(200).json({
        message: 'ok',
      })
    } catch (error) {
      console.log('this.createCategory error: ' + error)

      return res.status(400)
    }
  }

  getCategoryBySlug = async (req, res) => {
    try {
      let { slug } = req.params
      // let _cate = await ProductCategory.findOne({ slug })

      let { price, createdAt, activePage, pageSize, maxPrice, stock_status } = req.query

      let pageS = pageSize || 10

      let activeP = (activePage > 0 && activePage) || 1

      const UNIT_PRICE = 1000000

      const MAXPRICE = Number(maxPrice) * UNIT_PRICE || 999 * UNIT_PRICE

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
            price: price || 1,
            createdAt: createdAt || 1,
          },
        },
        {
          $match: {
            'child.price': {
              $lt: MAXPRICE,
            },
          },
        },
      ]

      const [total] = await ProductCategory.aggregate([...pipeAggregate, { $count: 'total' }])

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
          $skip: +activeP * +pageS - +pageS,
        },
        {
          $limit: +pageS,
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

      console.log()

      const seoTags = await generateSeoTag({
        title: `${_cate.name} mới nhất giá rẻ - Khamobile`,
        description: `${_cate.name} mới nhất giá rẻ - Khamobile`,
        url: `${process.env.HOSTNAME}/product/${_cate.slug}`,
      })

      return res.status(200).json({
        data: { cate: _cate, product: _cateProd, total: total?.total, seo: [seoTags.head, seoTags.body] },
      })
    } catch (error) {
      console.log('this.getCategoryBySlug error: ' + error)

      return res.status(400)
    }
  }
}
