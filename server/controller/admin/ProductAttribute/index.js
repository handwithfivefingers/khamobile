import { ProductAttribute, ProductAttributeTerm } from '#server/model'
import Response from '#server/response'
import mongoose from 'mongoose'

export default class ProductAttributeController {
  getAttributeWithTerm = async (req, res) => {
    try {
      let _attr = await ProductAttribute.aggregate([
        {
          $lookup: {
            from: 'productattributeterms',
            localField: '_id',
            foreignField: 'parentId',
            as: 'child',
          },
        },
        {
          $unwind: '$child',
        },
        {
          $group: {
            _id: {
              key: '$key',
              _id: '$_id',
            },
            item: {
              $push: {
                name: '$child.name',
                _id: '$child._id',
              },
            },
          },
        },
      ])

      return new Response().fetched({ data: _attr }, res)
    } catch (error) {
      console.log('getAttribute error: ' + error)
      return new Response().error(error, res)
    }
  }

  getAttributeWithTermById = async (req, res) => {
    try {
      let _attr = await ProductAttributeTerm.find({ parentId: req.params._id }).select('_id name parentId')

      return new Response().fetched({ data: _attr }, res)
    } catch (error) {
      console.log('getAttribute error: ' + error)
      return new Response().error(error, res)
    }
  }

  handleSaveAttributesTerm = async (req, res) => {
    try {
      const data = req.body
      const { _id } = req.params

      if (!_id) throw { message: 'Invalid attribute' }

      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        let _id = item._id || new mongoose.Types.ObjectId()
        if (item.delete) {
          await ProductAttributeTerm.deleteOne({ _id: _id })
        } else {
          await ProductAttributeTerm.updateOne(
            { _id: _id },
            { name: item.name, parentId: item.parentId },
            { upsert: true },
          )
        }
      }

      return new Response().updated({}, res)
    } catch (error) {
      return new Response().error(error, res)
    }
  }

  createAttributes = async (req, res) => {
    try {
      const { key } = req.body

      const _attribute = new ProductAttribute({
        key,
      })

      await _attribute.save()

      return new Response().created({}, res)
    } catch (error) {
      return new Response().error(error, res)
    }
  }

  getAttribute = async (req, res) => {
    try {
      const _attr = await ProductAttribute.find({})
      return new Response().fetched({ data: _attr }, res)
    } catch (error) {
      return new Response().error(error, res)
    }
  }
  deleteAttributes = async (req, res) => {
    try {
      const { _id } = req.params

      await ProductAttribute.deleteOne({ _id: _id }, { new: true })

      await ProductAttributeTerm.deleteMany({ parentId: _id })

      return new Response().deleted({}, res)
    } catch (error) {
      return new Response().error(error, res)
    }
  }
}
