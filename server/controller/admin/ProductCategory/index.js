import { ProductCategory } from '#model'
import { MESSAGE } from '#server/constant/message'
import Response from '#server/response'
import mongoose from 'mongoose'
import shortid from 'shortid'

export default class ProductCategoryController {
  getCategory = async (req, res) => {
    try {
      const { type } = req.query

      let _category = []

      if (type === 'parent') {
        _category = await ProductCategory.aggregate([
          {
            $match: {
              parent: { $exists: false },
            },
          },
          {
            $lookup: {
              from: 'productcategories',
              localField: '_id',
              foreignField: 'parent',
              as: 'children',
            },
          },
        ])

        _category = _category.map((item) => ({
          ...item,
          dynamicRef: 'ProductCategory',
          children: item.children.length && this.addField(item.children),
        }))
      } else {
        _category = await ProductCategory.find({})
          .select('-createdAt -updatedAt -__v')
          .sort({ createdAt: -1, updatedAt: -1 })
        _category = _category.map((item) => ({
          ...item._doc,
          dynamicRef: 'ProductCategory',
          children: item.children?.length && this.addField(item.children),
        }))
      }

      return new Response().fetched({ data: _category }, res)
    } catch (error) {
      console.log(error)
      return new Response().error(error, res)
    }
  }

  getCategoryById = async (req, res) => {
    try {
      const { _id } = req.params

      let _cate = await ProductCategory.findOne({ _id: mongoose.Types.ObjectId(_id) }).select(
        '-createdAt -updatedAt -__v',
      )

      if (!_cate) throw { message: MESSAGE.RESULT_NOT_FOUND() }

      return new Response().fetched({ data: _cate }, res)
    } catch (error) {
      return new Response().error(error, res)
    }
  }

  deleteCategoryById = async (req, res) => {
    try {
      const { _id } = req.params

      let _cate = await ProductCategory.deleteOne({ _id: mongoose.Types.ObjectId(_id) })

      if (!_cate) throw { message: MESSAGE.RESULT_NOT_FOUND() }

      return new Response().deleted({}, res)
    } catch (error) {
      return new Response().error(error, res)
    }
  }

  createCategory = async (req, res) => {
    try {
      const { name, description, slug, image } = req.body

      let newSlug = slug

      const _prodExist = await ProductCategory.findOne({ slug: slug })

      if (_prodExist) {
        newSlug = newSlug + '-' + shortid()
      }

      const _prodCate = new ProductCategory({ name, description, slug: newSlug, image })

      await _prodCate.save()

      return new Response().created({}, res)
    } catch (error) {
      console.log('this.createCategory error: ' + error)
      return new Response().error(error, res)
    }
  }

  updateCategory = async (req, res) => {
    try {
      const { _id } = req.params

      let { ...formData } = req.body

      await ProductCategory.updateOne({ _id: mongoose.Types.ObjectId(_id) }, { ...formData }, { new: true })

      return new Response().updated({}, res)
    } catch (error) {
      console.log('this.createCategory error: ' + error)

      return new Response().error(error, res)
    }
  }

  filterCategoryWithParentId = (data = []) => {
    try {
      const parentCategories = data.filter((cate) => cate.parent)
      const childCategories = data.filter((cate) => !cate.parent)
      const result = []
      console.log(childCategories)
      for (let parentCate of parentCategories) {
        // parentCate
        const newParent = { ...parentCate._doc, children: [] }

        const item = childCategories.filter((child) => child.parent.toString() === newParent._id.toString())

        if (item) {
          newParent.children = item
        }
        result.push(newParent)
      }

      console.log('result ::::::::::::::::')
      console.log(result)
      return result
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  addField = (data) => {
    return data.map((item) => ({ ...item, dynamicRef: 'ProductCategory' }))
  }
}
