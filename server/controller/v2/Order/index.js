import { MESSAGE } from '#server/constant/message'
import { Order, User } from '#server/model'
import _ from 'lodash'
import mongoose from 'mongoose'
import MailServer from '#controller/Service/MailServer'
import { formatCurrency } from '#common/helper'
import TEMPLATE_MAIL from '#constant/templateMail'
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

      const newProd = product?.map((_prod) => ({
        title: _prod.title,
        price: formatCurrency(_prod.price, { symbol: '' }),
        image: {
          src: `${process.env.API}${_prod.image.src}`,
        },
      }))

      const mailObject = {
        Subject: 'Tạo đơn hàng thành công',
        Email: req.body.email,
        Name: req.body.username,
        TemplateID: TEMPLATE_MAIL.CREATE_ORDER,
        Variables: {
          firstName: req.body.firstName,
          order_id: orderId,
          product: newProd,
        },
      }

      console.log(mailObject)

      await new MailServer().sendMailOnly(mailObject)

      return res.status(200).json({
        message: 'Tạo đơn hàng thành công',
        orderId,
      })
    } catch (error) {
      console.log('createOrder error', error)
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
