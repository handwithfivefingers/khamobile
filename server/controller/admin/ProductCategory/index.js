import { ProductCategory } from '#model'
import { MESSAGE } from '#server/constant/message'
import Response from '#server/response'
import mongoose from 'mongoose'
import shortid from 'shortid'

export default class ProductCategoryController {
  getCategory = async (req, res) => {
    try {
      // let _category = await ProductCategory.find({ parent: { $exists: false } }).select('-createdAt -updatedAt -__v')
      let _category = await ProductCategory.find({}).select('-createdAt -updatedAt -__v')

      return new Response().fetched({ data: _category }, res)
    } catch (error) {
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
}
