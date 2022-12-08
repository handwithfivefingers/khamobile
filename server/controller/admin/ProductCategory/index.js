import ProductCate from '#uploads/mockup/product_category.json' assert { type: 'json' }
import { ProductCategory } from '#model'
import mongoose from 'mongoose'
import { handleDownloadFile } from '#middleware'

export default class ProductCategoryController {
  // getProductCategory = async (req, res) => {
  //   try {
  //     let _cate = await ProductCategory.find()

  //     return res.status(200).json({
  //       data: _cate,
  //     })
  //   } catch (error) {
  //     return res.status(400).json({
  //       error,
  //     })
  //   }
  // }

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

      console.log('updateCategory files', req.files)

      console.log('updateCategory formData', formData.image)

      if (req.files.image?.length) {
        let [img] = req.files.image.map(({ filename }) => ({
          src: `/public/${filename}`,
          name: filename,
        }))

        formData.image = img
      } else if (formData.image) {
        // handleDownloadFile

        let listPromise = handleDownloadFile(formData.image)

        const respImgDownload = await Promise.all(listPromise)

        let [img] = respImgDownload.map(({ filename, name }) => ({
          name,
          src: `/public/${filename}`,
        }))

        formData.image = img
      }

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
