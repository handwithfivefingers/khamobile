import { MESSAGE } from '#server/constant/message'
import { Order, User } from '#server/model'
import isEqual from 'lodash/isEqual'
import mongoose, { mongo } from 'mongoose'
import MailServer from '#controller/Service/MailServer'
import { formatCurrency } from '#common/helper'
import TEMPLATE_MAIL from '#constant/templateMail'
import shortid from 'shortid'
import moment from 'moment'
import PaymentController from '#controller/Service/Payment'
export default class OrderController {
  handleCreateOrder = async (req, res) => {
    try {
      let {
        userInformation,
        deliveryInformation,

        deliveryType,
        paymentType,
        amount,
        status,
        product,
      } = req.body
      let result = {
        message: 'Create order successfully',
      }
      // Create User
      /**
       * Step1: Checking user
       * Step1.1: If(login) -> next
       * Step1.2: If(!login) -> create User
       * Step2: Create Order
       * Step3: Send mail
       */

      let userId = req.body.userId

      let urlPayment
      const createDate = moment().format('YYYYMMDDHHmmss')

      const orderObject = {
        userInformation,
        deliveryInformation,
        deliveryType,
        paymentType,
        amount,
        status,
        product,
        createDate,
      }
      if (userId) orderObject.userId = userId

      const response = await this.createOrder(orderObject)

      if (!response.status) throw { message: 'Create order failed' }

      const responseMailSending = await this.sendMail({
        email: userInformation.email,
        username: userInformation.fullName,
        firstName: userInformation.fullName,
        orderId: response.orderId,
        product,
      })

      if (!responseMailSending.status) throw { message: 'Cant send mail' }

      if (paymentType === 'vnpay') {
        const paymentResp = await new PaymentController().createLinkPayment({
          createDate: createDate,
          orderId: moment().format('HHmmss'),
          amount,
          orderInfo: response.orderId,
          ip:
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress,
        })
        urlPayment = paymentResp.url
      }

      result.orderId = response.orderId
      result.urlPayment = urlPayment

      return res.status(200).json(result)
    } catch (error) {
      console.log('handleCreateOrder: ' + error)
      return res.status(400).json({
        message: 'create order failed',
        error: error,
      })
    }
  }

  createOrder = async ({
    userId,
    userInformation,
    deliveryInformation,
    deliveryType,
    paymentType,
    amount,
    status,
    product,
    createDate,
  }) => {
    try {
      const orderId = new mongoose.Types.ObjectId()

      let order = new Order({
        _id: orderId,
        userId,
        userInformation,
        deliveryInformation,
        deliveryType,
        paymentType,
        amount,
        status,
        product: product.map((item) => {
          if (item.variantId) {
            return {
              variantId: item.variantId,
              quantity: item.quantity,
            }
          } else {
            return {
              productId: item._id,
              quantity: item.quantity,
            }
          }
        }),
        createDate,
      })

      await order.save()

      return { orderId, status: true }
    } catch (error) {
      console.log('createOrder error', error)
      throw error
    }
  }

  getOrderById = async (req, res) => {
    try {
      let { _id } = req.params

      let _order = await Order.findOne({
        _id: mongoose.Types.ObjectId(_id),
      })
        .populate({
          path: 'userId',
          select: 'firstName lastName phone email username createdDate -_id',
        })
        .populate({
          path: 'product.productId',
          select: 'title slug price -_id',
        })
        .populate({
          path: 'product.variantId',
          select: 'price attributes parentId ',
          populate: {
            path: 'parentId',
            model: 'Product',
            select: 'title -_id',
          },
        })
      // .populate({
      //   path: 'product.variantId.parentId',
      //   select: 'title',
      // })

      console.log(JSON.stringify(_order, null, 4))

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

  getOrders = async (req, res) => {
    try {
      if (!req.id) throw { message: 'You dont have permission' }
      const _order = await Order.find({ userId: req.id })
        .populate({
          path: 'userId',
          select: 'firstName lastName phone email username -_id',
        })
        .populate({
          path: 'product.productId',
          select: 'title slug price -_id',
        })
        .populate({
          path: 'product.variantId',
          select: 'price attributes parentId ',
          populate: {
            path: 'parentId',
            model: 'Product',
            select: 'title -_id',
          },
        })

      return res.status(200).json({
        data: _order,
        message: 'Get Order successfully',
      })
    } catch (error) {
      return res.status(400).json({
        message: 'Something went wrong',
        error,
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

      await new MailServer().sendMailOnly(mailObject)
      return { status: true }
    } catch (error) {
      console.log('sendMail error', error)
      throw error
    }
  }
}
