import ProductCate from '#uploads/mockup/product_category.json' assert { type: 'json' }
import { ProductCategory } from '#model'

export default class ProductCategoryController {
  getCategory = async (req, res) => {
    try {
      let _category = await ProductCategory.find({ parent: { $exists: false } }).select('-createdAt -updatedAt -__v')
      return res.status(200).json({
        _category,
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
}
