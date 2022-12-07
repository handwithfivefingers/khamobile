// const { Product, Category } = require('@model')
// const { successHandler, errHandler } = require('@response')
// const slugify = require('slugify')
import { MESSAGE } from '#server/constant/message'
import { ProductVariant, Product, ProductCategory, Order, User } from '#server/model'
import _ from 'lodash'
import mongoose from 'mongoose'
export default class OrderController {
  createOrder = async (req, res) => {
    try {
      const {
        userType,
        company,
        address_1,
        address_2,
        city,
        postCode,
        deliveryType,
        paymentType,
        amount,
        status,
        product,
      } = req.body

      let userId

      const orderId = new mongoose.Types.ObjectId()

      if (!userType) throw { message: 'Something went wrong' }

      if (userType === 'anonymous') {
        userId = new mongoose.Types.ObjectId()
        const { lastName, firstName, email, phone } = req.body
        let user = new User({
          _id: userId,
          lastName,
          firstName,
          email,
          phone,
        })
        await user.save()
      } else {
        userId = req.body.userId
      }

      let order = new Order({
        _id: orderId,
        userId,
        deliveryInformation: {
          company,
          address_1,
          city,
          postCode,
        },
        deliveryType,
        paymentType,
        amount,
        status,
        product,
      })

      await order.save()

      return res.status(200).json({
        message: 'Tạo đơn hàng thành công',
        orderId,
      })
    } catch (error) {
      return res.status(400).json({
        message: 'Tạo đơn hàng thất bại',
      })
    }
  }
  getOrderById = async (req, res) => {
    try {
      let { _id } = req.params
      let _order = await Order.findOne({ _id: mongoose.Types.ObjectId(_id) }).populate({
        path: 'userId',
        select: '-createdAt -updatedAt -__v -delete_flag -role',
      })

      return res.status(200).json({
        message: 'Get Order successfully',
        data: _order,
      })
    } catch (error) {
      return res.status(400).json({
        message: 'Get Order thất bại',
      })
    }
  }
}
