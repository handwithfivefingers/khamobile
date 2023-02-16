import { TYPE_VARIANT } from '#constant/type'
import { Product, ProductVariant } from '#model'
import mongoose, { startSession } from 'mongoose'
import Response from '#server/response'
import shortid from 'shortid'

export default class ProductController {
  getProduct = async (req, res) => {
    try {
      let _prod = await Product.find({})
        .populate('category')
        .select(
          '_id title price slug category stock_status type image attributes createdAt updatedAt description content',
        )
      // console.log(_prod)

      // let listProduct = _prod.map((prod, index) => {
      //   if (index === 59) {
      //     prod.content = prod.content.replace(/https:\/\/khamobile.vn\/wp-content\/uploads\//g, `${process.env.API}/public/`)
      //     console.log(prod.content)
      //   }

      //   return {
      //     ...prod._doc,
      //   }
      // })

      // console.log(listProduct)

      return new Response().fetched({ data: _prod }, res)
    } catch (error) {
      return new Response().error(error, res)
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
              pipeline: [
                {
                  $match: {
                    parentId: { $exists: true },
                  },
                },
              ],
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

        if (!_prod) {
          _prod = await Product.findOne({
            _id: mongoose.Types.ObjectId(_id),
          })
        }
      }

      if (_prod.content) {
        const pathImg = `${
          process.env.NODE_ENV !== 'development' ? process.env.API : 'https://app.khamobile.vn'
        }/public/wp/`

        if (_prod.content?.match(/https:\/\/khamobile.vn\/wp-content\/uploads\//g)) {
          _prod.content = _prod.content?.replace(/https:\/\/khamobile.vn\/wp-content\/uploads\//g, pathImg)

          _prod.description = _prod.description?.replace(/https:\/\/khamobile.vn\/wp-content\/uploads\//g, pathImg)
        }
      }

      return new Response().fetched({ data: _prod }, res)
    } catch (error) {
      console.log(error)
      return new Response().error(error, res)
    }
  }

  createProduct = async (req, res) => {
    try {
      let { ...formData } = req.body

      let result

      if (TYPE_VARIANT.VARIANT === req.body.type) {
        result = await this.createVariantProduct(formData)
      } else if (TYPE_VARIANT.SIMPLE === req.body.type) {
        result = await this.createSimpleProduct(formData)
      }

      if (!result.status) throw result.error

      return new Response().created({}, res)
    } catch (error) {
      console.log('create error', error)
      return new Response().error(error, res)
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

      let { type, title, slug, description, variations, content, primary, image, attributes, category } = formData

      const parentId = new mongoose.Types.ObjectId()

      let minPrice = 0

      if (variations) {
        minPrice = formData.variations?.reduce((prev, current) => {
          if (prev > current.price) {
            return current.price
          }
          return prev
        }, 0)
      }

      let baseProd = new Product({
        _id: parentId,
        title,
        slug,
        description,
        content,
        type,
        price: minPrice,
        primary,
        image,
        attributes,
        category,
      })

      await Product.create([baseProd], { session })

      if (variations) {
        for (let { _id, ...variant } of variations) {
          let _variantItem = new ProductVariant({
            ...variant,
            parentId: parentId,
          })

          await _variantItem.save()
        }
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
      if (!req.body._id) throw { message: 'Product doesnt exists' }

      let { ...formData } = req.body

      let result

      if (TYPE_VARIANT.VARIANT === req.body.type) {
        result = await this.updateVariantProduct(formData)
      } else if (TYPE_VARIANT.SIMPLE === req.body.type) {
        result = await this.updateSimpleProduct(formData)
      }

      if (!result) throw result.error

      return new Response().updated({}, res)
    } catch (error) {
      console.log('update Product error: ', error)
      return new Response().error(error, res)
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

      const {
        _id,
        type,
        title,
        slug,
        description,
        content,
        primary,
        variations,
        category,
        image,
        attributes,
        delete: listVariantDelete,
        deleteAll,
      } = formData
      let minPrice = 0
      if (variations) {
        minPrice = variations?.reduce((prev, current) => {
          if (prev > current.price) {
            return current.price
          }
          return prev
        }, 0)
      }

      const prodUpdate = {
        title,
        slug,
        description,
        content,
        type,
        price: minPrice || 0,
        primary,
        category,
        image,
        attributes,
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
      if (deleteAll) {
        await ProductVariant.deleteMany({ parentId: mongoose.Types.ObjectId(_id) })
        console.log('delete alll success')
      } else {
        if (variations) {
          for (let { _id: varsId, ...variant } of variations) {
            if (!varsId) {
              varsId = new mongoose.Types.ObjectId()
              variant.parentId = _id
            }
            await ProductVariant.updateOne(
              {
                _id: varsId,
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
        }
      }

      if (listVariantDelete?.length) {
        await ProductVariant.deleteMany({ _id: { $in: listVariantDelete.map((id) => mongoose.Types.ObjectId(id)) } })
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

      return new Response().deleted({}, res)
    } catch (error) {
      console.log(error)
      return new Response().error(error, res)
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

  duplicateProduct = async (req, res) => {
    try {
      const { _id } = req.body
      let parentProd = await Product.findOne({ _id: _id })
      let childProd
      let result
      let formData = {
        type: parentProd.type,
        title: parentProd.title + ' (copy)' + shortid(),
        slug: parentProd.slug + ' (copy)' + shortid(),
        description: parentProd.description,
        content: parentProd.content,
        image: parentProd.image,
        category: parentProd.category,
      }

      if (parentProd.type === TYPE_VARIANT.VARIANT) {
        childProd = await ProductVariant.find({ parentId: _id })

        const variations = childProd.map(({ _doc }) => {
          _doc
          let newObject = { ..._doc }
          delete newObject._id
          delete newObject.updatedAt
          delete newObject.createdAt
          delete newObject.__v
          delete newObject.parentId
          return newObject
        })

        formData.variations = variations || []
        formData.primary = parentProd?.primary
        formData.attributes = parentProd?.attributes
      }

      if (TYPE_VARIANT.VARIANT === parentProd.type) {
        result = await this.createVariantProduct(formData)
      } else if (TYPE_VARIANT.SIMPLE === parentProd.type) {
        result = await this.createSimpleProduct(formData)
      }
      if (!result.status) throw result.error

      return new Response().created({}, res)
    } catch (error) {
      console.log('create error', error)
      return new Response().error(error, res)
    }
  }
}
