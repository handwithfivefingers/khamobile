import { MESSAGE } from '#server/constant/message'
import { Product, ProductOption } from '#server/model'
import mongoose, { startSession } from 'mongoose'
import shortid from 'shortid'
import slugify from 'slugify'
import ProductModel from './Model'
import _ from 'lodash'
export default class ProductController {
  getProducts = async (req, res) => {
    try {
      let _prod = await ProductOption.aggregate([
        {
          $lookup: {
            from: 'products',
            localField: 'parentId',
            foreignField: '_id',
            as: 'child',
          },
        },
        {
          $unwind: '$child',
        },
        {
          $project: {
            _id: '$_id',
            title: ['$child.title', '$primaryKey'],
            slug: '$slug',
            price: '$price',
          },
        },
      ])

      console.log(_prod)

      return res.status(200).json({
        message: MESSAGE.FETCHED(),
        data: _prod,
      })
    } catch (error) {
      console.log(error)

      return res.status(400).json({
        message: MESSAGE.ERROR_ADMIN('Sản phẩm'),
      })
    }
  }

  createProduct = async (req, res) => {
    try {
      console.log(req.files)

      const obj = {
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        slug: req.body.slug + '-' + shortid(),
        category: req.body.category,
        type: req.body.type,
        primary_variant: req.body.primary_variant,
        primary_value: req.body.primary_value,
      }

      if (req.body.type === 'simple') {
        obj.price = req.body.price
      } else if (req.body.type === 'variant') {
        obj.variant = req.body.variant
      }

      if (req.files?.img) {
        obj.img = req.files?.img?.map((file) => ({
          src: '/public/' + file.filename,
        }))
      }

      const { ..._prodObject } = new ProductModel(obj)

      const _product = new Product(_prodObject)

      await _product.save()

      return res.status(200).json({
        message: MESSAGE.CREATED(),
        data: _product,
      })
    } catch (err) {
      console.log('createProduct error', err)

      return res.status(400).json({
        message: MESSAGE.ERROR_ADMIN('Sản phẩm'),
      })
    }
  }

  getProductById = async (req, res) => {
    try {
      let _product = await ProductOption.findOne({ _id: req.params._id })
        .populate({ path: 'parentId', select: 'spec.k spec.v' })
        .select('-variant -updatedAt -createdAt -__v ')

      let parentId = _product.parentId._id

      let _prodRelation = await ProductOption.find({ parentId: parentId }).populate({
        path: 'parentId',
        select: 'spec.k',
      })

      let formatProd = []

      for (let item of _prodRelation) {
        let obj = {
          _id: item._id,
          [item.parentId.spec?.k]: item.primaryKey,
        }

        if (item.variant) {
          for (let key in item.variant) {
            const value = item.variant[key]
            obj[key] = value
          }
        }
        obj = {
          ...obj,
          price: item.price,
          slug: item.slug,
        }
        formatProd.push(obj)
      }

      let _prod = {}

      for (let key in _product._doc) {
        let value = _product[key]
        if (key === 'parentId') {
          _prod.spec = value.spec
        }
        if (key !== 'parentId') {
          _prod[key] = value
        }
      }

      return res.status(200).json({
        message: MESSAGE.FETCHED(),
        data: _prod,
        variable: formatProd,
      })
    } catch (error) {
      console.log(error)
      return res.status(400).json({
        message: MESSAGE.ERROR_ADMIN('Sản phẩm'),
      })
    }
  }

  updateProduct = async (req, res) => {
    try {
      const { _id } = req.params

      let objUpdate = {}
      console.log(req.body)

      Object.keys(req.body).forEach((key) => {
        if (key === 'img') {
          if (Array.isArray(req.body[key])) {
            objUpdate[key] = [...req.body[key].map((item) => ({ src: item }))]
          } else {
            objUpdate[key] = [{ src: req.body[key] }]
          }
        } else if (key === 'variable') {
          const parse = JSON.parse(req.body[key])
          objUpdate[key] = parse
        } else {
          objUpdate[key] = req.body[key]
        }
      })

      if (req.files?.img?.length > 0) {
        objUpdate.img = [
          ...objUpdate.img,
          ...req.files.img?.map((file) => ({
            src: '/public/' + file.filename,
          })),
        ]
      }
      const { ...obj } = new ProductModel(objUpdate)

      const _prod = await Product.updateOne({ _id: _id }, obj, { new: true })
      console.log(_prod)
      return res.status(200).json({
        message: 'update product',
        data: _prod,
      })
    } catch (error) {
      console.log('update product error', error)
      return res.status(400).json({ error })
    }
  }

  createMutipleProduct = async (req, res) => {
    const session = await startSession()
    try {
      const { title, description, content, variant, keyVariant, price } = req.body

      session.startTransaction()

      const _id = new mongoose.Types.ObjectId()

      const slug = slugify(title.toLowerCase().split(' ').join('-'))

      let _prod = {
        _id,
        title,
        slug,
        description,
        content,
      }

      if (variant.length > 0) {
        let spec = variant.reduce(
          (prev, current) => {
            prev.k = current?.k
            prev.v = [...prev.v, current?.v]
            return prev
          },
          { k: '', v: [] },
        )
        _prod.spec = spec
        _prod.keyVariant = keyVariant
      }

      let _model = new Product(_prod)

      await Product.create([_model], { session })
      // await _model.save()

      for (let _var of variant) {
        for (let item of _var?.items) {
          await this.createProductOption({ parentId: _id, variant: item, primaryKey: _var.v, slug })
        }
      }
      // create product Option

      // -> done
      await session.commitTransaction()

      return res.status(200).json({
        message: 'ok',
      })
    } catch (error) {
      console.log(error)
      await session.abortTransaction()
      return res.status(400).json({
        error,
      })
    } finally {
      session.endSession()
    }
  }

  /**
   *
   * @param {*} parentId
   * @param { *__key : value, price }  variant
   */
  createProductOption = async ({ parentId, variant, primaryKey = '', slug }) => {
    try {
      let newSlug = slug + '-' + primaryKey

      let _product = {
        parentId,
        primaryKey,
        slug: slugify(newSlug) + '-' + shortid(),
      }

      if (variant) {
        let { price, ...variable } = variant

        _product.variant = { ...variable }
        _product.price = price
      }
      let _model = new ProductOption(_product)
      await _model.save()
    } catch (error) {
      console.log('create error', error)
    }
  }

  getVariantProduct = async (req, res) => {
    try {
      let { primary } = req.query
      const pipe = [
        {
          $match: {
            slug: req.params.slug,
          },
        },
        {
          $lookup: {
            from: 'productoptions',
            localField: '_id',
            foreignField: 'parentId',
            as: 'child',
          },
        },

        {
          $project: {
            title: '$title',
            slug: '$slug',
            content: '$content',
            description: '$description',
            keyVariant: '$keyVariant',
            k: '$spec.k',
            v: '$spec.v',
            child: {
              $cond: {
                if: { $gt: [{ $size: '$child' }, 1] }, // length >1 1
                then: {
                  $filter: {
                    input: '$child',
                    as: 'item',
                    cond: {},
                  },
                },
                else: {
                  price: { $sum: '$child.price' }, // length <= 1
                },
              },
            },
          },
        },
        {
          $unwind: '$child',
        },
      ]
      if (primary) {
        pipe.push({
          $match: {
            'child.primaryKey': primary,
          },
        })
      }
      let _product = await Product.aggregate(pipe)

      return res.status(200).json({
        message: MESSAGE.FETCHED(),
        data: _product,
      })
    } catch (error) {
      console.log(error)

      return res.status(400).json({
        message: MESSAGE.ERROR_ADMIN('Sản phẩm'),
      })
    }
  }

  getAllProduct = async (req, res) => {
    try {
      let _product = await Product.aggregate([
        // {
        //   $match: {
        //     slug: req.params.slug,
        //   },
        // },
        {
          $lookup: {
            from: 'productoptions',
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
            title: [`$title`, `$child.primaryKey`],
            slug: '$slug',
            content: '$content',
            description: '$description',
            k: '$spec.k',
            variant: '$child.variant',
            primaryKey: '$child.primaryKey',
            price: '$child.price',
          },
        },
        // {
        //   $unwind: '$child',
        // },
      ])

      return res.status(200).json({
        message: MESSAGE.FETCHED(),
        data: _product,
      })
    } catch (error) {
      console.log(error)

      return res.status(400).json({
        message: MESSAGE.ERROR_ADMIN('Sản phẩm'),
      })
    }
  }
}
