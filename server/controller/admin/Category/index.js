import { Category, ProductCategory } from '#model'
import { MESSAGE } from '#server/constant/message'
import { handleDownloadFile } from '#server/middleware'
import Response from '#server/response'
import shortid from 'shortid'
import slugify from 'slugify'

class CategoryController {
  createCategory = async (req, res) => {
    try {
      let { name, description, slug, parentCategory, type } = req.body

      let _cate = await Category.findOne({ slug })

      if (_cate) slug = slugify(name.toLowerCase() + '-' + shortid())

      let file = req.files

      let fileLength = Object.keys(file).length

      if (!fileLength && req.body.categoryImg && typeof req.body.categoryImg === 'string') {
        file = await handleDownloadFile(req.body.categoryImg)
        file = [file]
      } else file = file.categoryImg

      let _created = {
        name,
        description,
        slug: slug || slugify(req.body.name),
        categoryImg: file,
        type: type || 'category',
      }
      if (parentCategory) {
        _created.parentCategory = parentCategory
      }

      const _obj = new Category(_created)

      let data = await _obj.save()

      return new Response().created({ data }, res)
    } catch (error) {
      console.log('CategoryController createCategory', error)

      return res.status(400).json({
        message: MESSAGE.ERROR_ADMIN('danh mục'),
      })
    }
  }

  updateCategory = async (req, res) => {
    try {
      let { _id } = req.params

      let { name, description, slug, parentCategory } = req.body

      let isFile = false

      let file = null

      if (req.files || typeof req.body.categoryImg === 'string') {
        isFile = true
        file = req.files

        let fileLength = Object.keys(file).length

        if (!fileLength && typeof req.body.categoryImg === 'string') {
          file = await handleDownloadFile(req.body.categoryImg)
          file = [file]
        } else file = file.categoryImg
      }

      let _updated = {
        name,
        description,
        slug: slug || slugify(req.body.name),
      }

      if (isFile) {
        _updated.categoryImg = file
      }

      if (parentCategory) {
        _updated.parentCategory = parentCategory
      }

      let data = await Category.updateOne({ _id }, _updated, { new: true })
      return new Response().updated({ data }, res)
    } catch (error) {
      return res.status(400).json({
        message: error?.message || MESSAGE.ERROR_ADMIN('danh mục'),
      })
    }
  }

  getSingleCategory = async (req, res) => {
    try {
      let { _id } = req.params

      let _cate = await Category.findOne({
        _id,
      }).select('-__v -createdAt -updatedAt')
      return new Response().fetched({ data: _cate }, res)
    } catch (error) {
      console.log('getSingleCategory', error)
      return new Response().error(error, res)
    }
  }

  getCategory = async (req, res) => {
    try {
      let { type } = req.query

      let _cate = await Category.find({
        type,
      }).select('-__v -createdAt -updatedAt')

      let _data = this.filterCate(_cate)

      return new Response().fetched({ data: _data }, res)
    } catch (error) {
      console.log('getCategory', error)
      return new Response().error(error, res)
    }
  }

  filterCate = (cateList, parentCategory = null) => {
    try {
      const categoryList = []

      let category

      if (parentCategory == null) {
        category = cateList.filter((cat) => cat.parentCategory == undefined)
      } else {
        category = cateList.filter((cat) => cat.parentCategory?.equals(parentCategory))
      }
      for (let cate of category) {
        categoryList.push({
          ...cate._doc,
          children: this.filterCate(cateList, cate._id),
        })
      }

      return categoryList.length > 0 ? categoryList : null
    } catch (error) {
      console.log('filterCate', error)
      throw error
    }
  }

  getProductCategory = async (req, res) => {
    try {
      let _cate = await ProductCategory.find()

      return new Response().fetched({ data: _cate }, res)
    } catch (error) {
      return new Response().error(error, res)
    }
  }
}

const { ...CateController } = new CategoryController()

export default CateController
