import { MESSAGE } from '#server/constant/message'
import { Product, ProductVariant } from '#model'
import mongoose, { mongo, startSession } from 'mongoose'
import shortid from 'shortid'
import slugify from 'slugify'
import ProductModel from './Model'
import _ from 'lodash'
import { TYPE_VARIANT } from '#constant/type'
import { handleDownloadFile } from '#middleware'
export default class ProductController {
  getProduct = async (req, res) => {
    try {
      let _prod = await Product.find({})
      return res.status(200).json({
        data: _prod,
      })
    } catch (error) {
      return res.status(400).json({
        error,
      })
    }
  }

  getProductById = async (req, res) => {
    try {
      let { _id } = req.params
      let { type } = req.query

      let _prod

      if (type === 'simple') {
        _prod = await Product.findOne({
          _id: mongoose.Types.ObjectId(_id),
        })
      } else if (type === 'variable') {
        let [_prodAggregate] = await Product.aggregate([
          {
            $match: {
              _id: mongoose.Types.ObjectId(_id),
            },
          },
          {
            $lookup: {
              from: 'productvariants',
              localField: '_id',
              foreignField: 'parentId',
              as: 'variations',
            },
          },
          {
            $unwind: '$variations',
          },
          {
            $project: {
              _id: '$_id',
              slug: '$slug',
              title: '$title',
              description: '$description',
              content: '$content',
              category: '$category',
              type: '$type',
              image: '$image',
              primary: '$primary',
              'attr._id': '$variations._id',
              'attr.price': '$variations.price',
              'attr.regular_price': '$variations.regular_price',
              'attr.purchasable': '$variations.purchasable',
              'attr.stock_status': '$variations.stock_status',
              'attr.attributes': '$variations.attributes',
              'attr.parentId': '$variations.parentId',
              attributes: '$attributes',
            },
          },
          {
            $group: {
              _id: {
                _id: '$_id',
                slug: '$slug',
                title: '$title',
                description: '$description',
                content: '$content',
                category: '$category',
                type: '$type',
                primary: '$primary',
                image: '$image',
                attributes: '$attributes',
              },
              variations: {
                $push: {
                  _id: '$attr._id',
                  price: '$attr.price',
                  regular_price: '$attr.regular_price',
                  purchasable: '$attr.purchasable',
                  stock_status: '$attr.stock_status',
                  attributes: '$attr.attributes',
                },
              },
            },
          },
          {
            $project: {
              _id: '$_id._id',
              title: '$_id.title',
              slug: '$_id.slug',
              description: '$_id.description',
              content: '$_id.content',
              category: '$_id.category',
              type: '$_id.type',
              primary: '$_id.primary',
              variations: '$variations',
              image: '$_id.image',
              attributes: '$_id.attributes',
            },
          },
        ])

        _prod = _prodAggregate
      }

      // for (let prod of _prod) {
      //   if (prod._doc.attributes.length) {
      //     prod._doc.attributes = prod._doc.attributes.map((item) => {
      //       return {
      //         key: item?.parentId?.key,
      //         value: item?.name,
      //       }
      //     })
      //   }
      //   data.push(prod)
      // }

      return res.status(200).json({
        data: _prod,
      })
    } catch (error) {
      console.log(error)
      return res.status(400).json({
        error,
      })
    }
  }

  createProduct = async (req, res) => {
    try {
      let { ...formData } = req.body

      console.log('formData', formData)

      let result

      if (TYPE_VARIANT.VARIANT === req.body.type) {
        result = await this.createVariantProduct(formData)
      } else if (TYPE_VARIANT.SIMPLE === req.body.type) {
        result = await this.createSimpleProduct(formData)
      }

      if (!result) throw result.error
      return res.status(200).json({
        message: 'ok',
      })
    } catch (error) {
      console.log('create error', error)
      return res.status(400).json({ error })
    }
  }

  createSimpleProduct = async (formData) => {
    let session = await startSession()
    try {
      session.startTransaction()

      let { type, title, slug, description, content, price, image } = formData

      const parentId = new mongoose.Types.ObjectId()

      let baseProd = new Product({
        _id: parentId,
        title,
        slug,
        description,
        content,
        type,
        price,
        image,
      })

      await Product.create([baseProd], { session })

      await session.commitTransaction()

      return { status: true }
    } catch (error) {
      console.log('coming createSimpleProduct error ', error)

      await session.abortTransaction()
      return { status: false, error }
    } finally {
      session.endSession()
    }
  }

  createVariantProduct = async (formData) => {
    let session = await startSession()
    try {
      session.startTransaction()

      let { type, title, slug, description, content, primary, variations, image, attributes, category } = formData

      const parentId = new mongoose.Types.ObjectId()

      let minPrice = variations?.reduce((prev, current) => (prev.price > +current.price ? current : prev))

      let baseProd = new Product({
        _id: parentId,
        title,
        slug,
        description,
        content,
        type,
        price: minPrice.price,
        primary,
        image,
        attributes,
        category,
      })

      await Product.create([baseProd], { session })

      for (let { _id, ...variant } of variations) {
        let _variantItem = new ProductVariant({
          ...variant,
          parentId: parentId,
        })

        await _variantItem.save()
      }

      await session.commitTransaction()

      return { status: true }
    } catch (error) {
      console.log('coming createVariantProduct error ', error)

      await session.abortTransaction()
      return { status: false, error }
    } finally {
      session.endSession()
    }
  }

  updateProduct = async (req, res) => {
    try {
      console.log(req.body)

      if (!req.body._id) throw { message: 'Product doesnt exists' }

      let { ...formData } = req.body

      console.log('formData', formData)

      let result

      if (TYPE_VARIANT.VARIANT === req.body.type) {
        result = await this.updateVariantProduct(formData)
      } else if (TYPE_VARIANT.SIMPLE === req.body.type) {
        result = await this.updateSimpleProduct(formData)
      }

      if (!result) throw result.error
      return res.status(200).json({
        message: 'Updated th??nh c??ng',
      })
    } catch (error) {
      console.log('update Product error: ', error)
      return res.status(400).json({ error })
    }
  }

  updateSimpleProduct = async (formData) => {
    let session = await startSession()
    try {
      session.startTransaction()
      if (formData.type !== TYPE_VARIANT.SIMPLE) throw { message: 'Type didtn match' }

      let { _id, type, title, slug, description, content, price, category, image } = formData

      const objUpdate = {
        type,
        title,
        slug,
        description,
        content,
        price,
        category,
        image,
      }

      await Product.updateOne(
        { _id: mongoose.Types.ObjectId(_id) },
        {
          ...objUpdate,
        },
        {
          upsert: true,
          new: true,
          session,
        },
      )

      await session.commitTransaction()

      return { status: true }
    } catch (error) {
      console.log('coming updateSimpleProduct error ', error)

      await session.abortTransaction()
      return { status: false, error }
    } finally {
      session.endSession()
    }
  }

  updateVariantProduct = async (formData) => {
    let session = await startSession()
    try {
      if (formData.type !== TYPE_VARIANT.VARIANT) throw { message: 'Type didtn match' }

      session.startTransaction()

      const { _id, type, title, slug, description, content, primary, variations, category, image } = formData

      const minPrice = variations?.reduce((prev, current) => (prev.price > +current.price ? current : prev))

      const prodUpdate = {
        title,
        slug,
        description,
        content,
        type,
        price: minPrice.price,
        primary,
        category,
        image,
      }

      await Product.updateOne(
        {
          _id: mongoose.Types.ObjectId(_id),
        },
        {
          ...prodUpdate,
        },
        {
          upsert: true,
          new: true,
          session,
        },
      )

      for (let { _id: varsId, ...variant } of variations) {
        await ProductVariant.updateOne(
          {
            _id: mongoose.Types.ObjectId(varsId),
          },
          {
            ...variant,
          },
          {
            upsert: true,
            new: true,
            session,
          },
        )
      }

      await session.commitTransaction()

      return { status: true }
    } catch (error) {
      console.log('coming updateVariantProduct error ', error)
      await session.abortTransaction()
      return { status: false, error }
    } finally {
      session.endSession()
    }
  }

  deleteProduct = async (req, res) => {
    try {
      const { _id } = req.body
      let result
      if (!_id) throw { message: 'Product doesnt exists' }

      if (TYPE_VARIANT.VARIANT === req.body.type) {
        result = await this.deleteVariantProduct(_id)
      } else if (TYPE_VARIANT.SIMPLE === req.body.type) {
        result = await this.deleteSimpleProduct(_id)
      }

      if (!result) throw result.error

      return res.status(200).json({
        message: 'Product deleted',
        result,
      })
    } catch (error) {
      console.log(error)
      return res.status(400).json({
        message: 'Failed',
        error,
      })
    }
  }

  deleteSimpleProduct = async (_id) => {
    try {
      await Product.deleteOne({ _id: mongoose.Types.ObjectId(_id) })
      return { status: true }
    } catch (error) {
      console.log('deleteSimpleProduct error', error)
      return { status: false, error }
    }
  }

  deleteVariantProduct = async (_id) => {
    try {
      await Product.deleteOne({ _id: mongoose.Types.ObjectId(_id) })

      await ProductVariant.deleteMany({ parentId: mongoose.Types.ObjectId(_id) })

      return { status: true }
    } catch (error) {
      console.log('deleteVariantProduct error', error)
      return { status: false, error }
    }
  }
}
