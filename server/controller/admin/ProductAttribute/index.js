import { ProductAttribute, ProductAttributeTerm } from '#server/model'
import { MESSAGE } from '#server/constant/message'
import ProductVariableModel from './Model'
import { Success, Error } from '#server/common/responseStatus'
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

      return Success({ res, message: 'Get Attribute Success', data: _attr })
    } catch (error) {
      console.log('getAttribute error: ' + error)
      return Error({ res, message: 'Something went wrong', error })
    }
  }

  getAttributeWithTermById = async (req, res) => {
    try {
      let _attr = await ProductAttributeTerm.find({ parentId: req.params._id }).select('_id name parentId')

      return res.status(200).json({
        data: _attr,
      })
    } catch (error) {
      console.log('getAttribute error: ' + error)
      return Error({ res, message: 'Something went wrong', error })
    }
  }

  handleSaveAttributesTerm = async (req, res) => {
    try {
      const data = req.body
      const _id = req.params

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
      return Success({ res, message: 'Modify Attribute Success', data: [] })
    } catch (error) {
      return Error({ res, message: error?.message || 'Something went wrong', error })
    }
  }

  createAttributes = async (req, res) => {
    try {
      const { key } = req.body

      const _attribute = new ProductAttribute({
        key,
      })

      await _attribute.save()

      return Success({ res, message: 'Attribute saved successfully', data: [] })
    } catch (error) {
      return Error({ res, message: 'Something went wrong', error })
    }
  }

  getAttribute = async (req, res) => {
    try {
      const _attr = await ProductAttribute.find({})
      return Success({ res, message: 'Get Attribute Success', data: _attr })
    } catch (error) {
      return Error({ res, message: 'Something went wrong', error })
    }
  }
}
