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
      const { userType, deliveryInformation, deliveryType, paymentType, amount, status, product } = req.body

      let userId

      if (userType === 'anonymous') {
        userId = new mongoose.Types.ObjectId()
        const { lastName, firstName, email, phone } = req.body?.userInformation
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

        let order = new Order({
          userId,
          deliveryInformation,
          deliveryType,
          paymentType,
          amount,
          status,
          product,
        })

        await order.save()
      }

      return res.status(200).json({
        message: 'Tạo đơn hàng thành công',
      })
    } catch (error) {
      return res.status(400).json({
        message: 'Tạo đơn hàng thất bại',
      })
    }
  }
}
