import { ProductCategory } from '#model'

export default class ProductCategoryController {
  getCategory = async (req, res) => {
    try {
      let { type } = req.query
      // console.log(query)
      let _category
      // let result = []
      // if (type === 'all') {
      //   _category = await ProductCategory.find().select('-createdAt -updatedAt -__v')
      // } else {
      //   _category = await ProductCategory.find({ parent: { $exists: false } }).select('-createdAt -updatedAt -__v')
      // }

      // if (type === 'all') {
      //   // result = _category.
      //   let parent = _category.filter((item) => !item.parent)
      //   let children = _category.filter((item) => item.parent)
      //   for (let item of _category) {

      //   }
      // }

      _category = await ProductCategory.aggregate([
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
      console.log(_category)
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

      let [_cate] = await ProductCategory.aggregate([
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
      ])

      return res.status(200).json({
        data: _cate,
      })
    } catch (error) {
      console.log('this.getCategoryBySlug error: ' + error)

      return res.status(400)
    }
  }
}
