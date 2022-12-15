import { MESSAGE } from '#server/constant/message'
import { Order, User } from '#server/model'
import isEqual from 'lodash/isEqual'
import mongoose, { mongo } from 'mongoose'
import MailServer from '#controller/Service/MailServer'
import { formatCurrency } from '#common/helper'
import TEMPLATE_MAIL from '#constant/templateMail'
import shortid from 'shortid'
export default class OrderController {
  handleCreateOrder = async (req, res) => {
    try {
      let {
        userType,
        email,
        firstName,
        lastName,
        phone,

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

      // Create User
      /**
       * Step1: Checking user
       * Step1.1: If(login) -> next
       * Step1.2: If(!login) -> create User
       * Step2: Create Order
       * Step3: Send mail
       */
      let userId = req.id
      let user, deliveryInformation
      if (!userId) {
        // const _user = await User.findOne({ email: email })
        // if(_user) {

        // }
        user = {
          _id: userId,
          username: shortid(),
          firstName,
          lastName,
          email,
          phone,
          delivery: {
            company,
            address_1,
            address_2,
            city,
            postCode,
          },
        }

        userId = new mongoose.Types.ObjectId()
        const _userSaved = new User(user)
        await _userSaved.save()
      } else {
        let _user = await User.findOne({ _id: mongoose.ObjectId(userId) })

        user = _user

        if (user) {
          let delivery = user.delivery

          let isdeliveryEqual = isEqual(delivery, { company, address_1, address_2, city, postCode })
          if (isdeliveryEqual) {
            deliveryInformation = {
              ...delivery,
            }
          } else {
            deliveryInformation = { company, address_1, address_2, city, postCode }
          }
        }
      }

      const response = await this.createOrder({
        userId,
        deliveryInformation,
        deliveryType,
        paymentType,
        amount,
        status,
        product,
      })

      if (!response.status) throw { message: 'Create order failed' }

      const responseMailSending = await this.sendMail({
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        orderId: response.orderId,
        product,
      })
      if (responseMailSending.status) {
        return res.status(200).json({
          message: 'Create order successfully',
          orderId: response.orderId,
        })
      }
    } catch (error) {
      console.log('handleCreateOrder: ' + error)
      return res.status(400).json({
        message: 'create order failed',
        error: error,
      })
    }
  }

  createOrder = async ({ userId, deliveryInformation, deliveryType, paymentType, amount, status, product }) => {
    try {
      const orderId = new mongoose.Types.ObjectId()

      let order = new Order({
        _id: orderId,
        userId,
        deliveryInformation,
        deliveryType,
        paymentType,
        amount,
        status,
        product,
      })

      await order.save()

      // return res.status(200).json({
      //   message: 'Tạo đơn hàng thành công',
      //   orderId,
      // })
      return { orderId, status: true }
    } catch (error) {
      console.log('createOrder error', error)
      throw error
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

  sendMail = async ({ email, username, firstName, orderId, product }) => {
    try {
      let subTotal = 0
      const _prod = product?.map((_prodItem) => {
        subTotal += +_prodItem.price

        return {
          title: _prodItem.title,
          price: formatCurrency(_prodItem.price, { symbol: '' }),
          image: {
            // src: `${process.env.API}${_prodItem.image.src}`, // for server
            src: `https://api.truyenmai.com${_prodItem.image.src}`,
          },
        }
      })

      const mailObject = {
        Subject: 'Tạo đơn hàng thành công',
        Email: email,
        Name: username,
        TemplateID: TEMPLATE_MAIL.CREATE_ORDER,
        Variables: {
          firstName,
          order_id: orderId,
          product: _prod,
          subTotal: formatCurrency(subTotal, { symbol: ' đ' }),
        },
      }

      console.log(JSON.stringify(mailObject, null, 2))

      await new MailServer().sendMailOnly(mailObject)
      return { status: true }
    } catch (error) {
      console.log('sendMail error', error)
      throw error
    }
  }
}
