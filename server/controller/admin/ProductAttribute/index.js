import { ProductAttribute } from '#server/model'
import { MESSAGE } from '#server/constant/message'
import ProductVariableModel from './Model'

export default class ProductAttributeController {
  // createVariable = async (req, res) => {
  //   try {
  //     const _existsVar = await ProductVariable.findOne({ key: req.body.key })

  //     if (_existsVar) {
  //       req.params._id = _existsVar._doc._id
  //       return this.updateVariable(req, res)
  //     }

  //     const _variable = {
  //       key: req.body.key,
  //       value: req.body.value?.filter((item) => item),
  //     }

  //     const _var = new ProductVariable(_variable)

  //     await _var.save()

  //     return res.status(200).json({
  //       message: MESSAGE.CREATED(),
  //       data: _var,
  //     })
  //   } catch (error) {
  //     console.log('createVariable error: ' + error)

  //     return res.status(400).json({
  //       message: MESSAGE.ERROR_ADMIN('Biến thể sản phẩm'),
  //     })
  //   }
  // }

  // updateVariable = async (req, res) => {
  //   try {
  //     const { _id } = req.params
  //     let _updated = {}
  //     if (req.body.type === 'add') {
  //       // Add
  //       _updated = {
  //         $push: {
  //           value: [req.body.value],
  //         },
  //       }
  //     } else if (req.body.type === 'remove') {
  //       // Remove
  //       _updated = {
  //         $pull: { value: { $in: [req.body.value] } },
  //       }
  //     }
  //     const _var = await ProductVariable.findOne({ _id })

  //     console.log(_var, req.body)

  //     await ProductVariable.updateOne({ _id: _id }, _updated, { new: true })

  //     return res.status(200).json({
  //       message: MESSAGE.UPDATED(),
  //     })
  //   } catch (error) {
  //     console.log('createVariable error: ' + error)

  //     return res.status(400).json({
  //       message: MESSAGE.ERROR_ADMIN('Biến thể sản phẩm'),
  //     })
  //   }
  // }

  // getVariable = async (req, res) => {
  //   try {
  //     const _var = await ProductVariable.find({ delete: 0 })

  //     let data = {}
  //     _var.forEach((item) => {
  //       data[item.key] = item.value
  //     })

  //     console.log(data)
  //     return res.status(200).json({
  //       message: MESSAGE.FETCHED(),
  //       data,
  //     })
  //   } catch (error) {
  //     console.log('getVariable error: ' + error)
  //     return res.status(400).json({
  //       message: MESSAGE.ERROR_ADMIN('Biến thể sản phẩm'),
  //     })
  //   }
  // }

  getAttribute = async (req, res) => {
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
            _id: '$key',
            item: {
              $push: {
                name: '$child.name',
                _id: '$child._id',
              },
            },
          },
        },
      ])

      return res.status(200).json({
        data: _attr,
      })
    } catch (error) {
      console.log('getAttribute error: ' + error)
      return res.status(400).json({
        error,
      })
    }
  }
}
