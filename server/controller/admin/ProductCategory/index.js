import ProductCate from '#uploads/mockup/product_category.json' assert { type: 'json' }
import { ProductCategory } from '#model'
import mongoose from 'mongoose'
import { handleDownloadFile } from '#middleware'
import shortid from 'shortid'

export default class ProductCategoryController {
  getCategory = async (req, res) => {
    try {
      // let _category = await ProductCategory.find({ parent: { $exists: false } }).select('-createdAt -updatedAt -__v')
      let _category = await ProductCategory.find({}).select('-createdAt -updatedAt -__v')
      return res.status(200).json({
        data: _category,
      })
    } catch (error) {
      return res.status(400)
    }
  }

  getCategoryById = async (req, res) => {
    try {
      const { _id } = req.params

      let _cate = await ProductCategory.findOne({ _id: mongoose.Types.ObjectId(_id) }).select(
        '-createdAt -updatedAt -__v',
      )

      if (!_cate) throw { message: 'Category not found' }

      return res.status(200).json({ data: _cate })
    } catch (error) {
      return res.status(400).json({ ...error })
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

      await _prodCate.save();

      return res.status(200).json({
        message: 'ok',
      })
    } catch (error) {
      console.log('this.createCategory error: ' + error)
      return res.status(400)
    }
  }

  updateCategory = async (req, res) => {
    try {
      const { _id } = req.params

      let { ...formData } = req.body

      await ProductCategory.updateOne({ _id: mongoose.Types.ObjectId(_id) }, { ...formData }, { new: true })

      return res.status(200).json({
        message: 'ok',
      })
    } catch (error) {
      console.log('this.createCategory error: ' + error)
      return res.status(400)
    }
  }
}
