import { MESSAGE } from '#server/constant/message'
import { Product, ProductVariant } from '#model'
import mongoose, { startSession } from 'mongoose'
import shortid from 'shortid'
import slugify from 'slugify'
import ProductModel from './Model'
import _ from 'lodash'
import { TYPE_VARIANT } from '#constant/type'
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
              primary: '$primary',
              'attr._id': '$variations._id',
              'attr.price': '$variations.price',
              'attr.regular_price': '$variations.regular_price',
              'attr.purchasable': '$variations.purchasable',
              'attr.stock_status': '$variations.stock_status',
              'attr.attributes': '$variations.attributes',
              'attr.parentId': '$variations.parentId',
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
      let { type } = req.body
      let result
      switch (type) {
        case TYPE_VARIANT.SIMPLE:
          result = await this.createSimpleProduct(req)
        case TYPE_VARIANT.VARIANT:
          result = await this.createVariantProduct(req)
      }

      if (!result) throw result.error
      return res.status(200).json({
        message: 'ok',
      })
    } catch (error) {
      return res.status(400).json({ error })
    }
  }

  createSimpleProduct = async (req) => {
    let session = await startSession()
    try {
      session.startTransaction()

      let { type, title, slug, description, content, price } = req.body

      const parentId = new mongoose.Types.ObjectId()

      let baseProd = new Product({
        _id: parentId,
        title,
        slug,
        description,
        content,
        type,
        price,
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

  createVariantProduct = async (req) => {
    let session = await startSession()
    try {
      session.startTransaction()

      let { type, title, slug, description, content, primary, variations } = req.body

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
      })

      await Product.create([baseProd], { session })

      for (let variant of variations) {
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
}
