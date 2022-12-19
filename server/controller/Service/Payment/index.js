// const qs = require('query-string')

// const { errHandler } = require('@server/response')

// const { Order } = require('@server/model')

// const MailService = require('@server/controller/user/Sendmail')

// const { sendmailWithAttachments } = new MailService()

// const { ResponseCode } = require('@server/common/ResponseCode')

// const { getVpnParams, sortObject } = require('@server/common/helper')

// const crypto = require('crypto')

// const { startSession } = require('mongoose')

// const urlReturn = process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api/order/payment/url_return' : process.env.RETURN_URL

// module.exports = class PaymentService {
//   testPayment = (req, res) => {
//     let { createDate, orderId, amount, orderInfo } = req.body

//     return this.paymentOrder(req, res, { createDate, orderId, amount, orderInfo })
//   }
//   paymentOrder = async (req, res, params) => {
//     const session = await startSession()

//     try {
//       let { createDate, orderId, amount, orderInfo } = params

//       let _update = {
//         orderInfo, // _id
//         orderCreated: createDate,
//         orderId,
//         amount,
//       }

//       // Start Transaction
//       session.startTransaction()

//       await Order.findOneAndUpdate({ _id: orderInfo }, _update, { session, new: true })

//       let vnp_Params = getVpnParams(req, params)

//       var vnpUrl = process.env.VNPAY_URL

//       vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false })

//       await new Promise((resolve) => setTimeout(resolve, 3000))

//       await session.commitTransaction()
//       session.endSession()
//       return res.status(200).json({ status: 200, url: vnpUrl })
//     } catch (err) {
//       console.log('paymentOrder', err)

//       await session.abortTransaction()

//       session.endSession()

//       return errHandler(err, res)
//     }
//   }

//   getUrlReturn = async (req, res) => {
//     console.log(req.query, ' Get URL Return')
//     var vnp_Params = req.query

//     var secureHash = vnp_Params['vnp_SecureHash']

//     delete vnp_Params['vnp_SecureHash']

//     delete vnp_Params['vnp_SecureHashType']

//     vnp_Params = sortObject(vnp_Params)

//     var tmnCode = process.env.TMN_CODE_VPN

//     var secretKey = process.env.SECRET_KEY_VPN

//     var signData = qs.stringify(vnp_Params, { encode: false })

//     var hmac = crypto.createHmac('sha512', secretKey)

//     var signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest('hex')

//     let url = process.env.NODE_ENV === 'development' ? `http://localhost:3000/user/order?` : `https://app.thanhlapcongtyonline.vn/user/order?`

//     if (secureHash === signed) {
//       //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
//       let code = vnp_Params['vnp_ResponseCode']
//       const query = qs.stringify({
//         code,
//         text: ResponseCode[code],
//       })

//       if (code === '00') {
//         // Success
//         const _update = {
//           payment: Number(1),
//         }

//         await Order.updateOne({ _id: req.query.vnp_OrderInfo }, _update, { new: true })

//         console.log('updated Success')

//         let _order = await Order.findOne({ _id: req.query.vnp_OrderInfo }).populate('orderOwner', '_id name email')

//         console.log(_order)

//         let params = {
//           email: _order?.orderOwner?.email || 'handgod1995@gmail.com',
//           subject: 'Thông tin thanh toán',
//           content: `Chào ${_order?.orderOwner?.name},<br /> Quý khách đã thanh toán thành công. Thông tin giấy tờ sẽ được gửi sớm nhất có thể, quý khách vui lòng đợi trong giây lát.<br/> Xin cảm ơn`,
//           type: 'any',
//         }

//         await sendmailWithAttachments(req, res, params)

//         return res.redirect(url + query)
//       }

//       return res.redirect(url + query)
//     } else {
//       const query = qs.stringify({
//         code: ResponseCode[97],
//       })

//       return res.redirect(url + query)
//     }
//   }

//   checkStatus = async (req, res) => {
//     var vnp_Params = req.query
//     var secureHash = vnp_Params['vnp_SecureHash']

//     delete vnp_Params['vnp_SecureHash']
//     delete vnp_Params['vnp_SecureHashType']

//     vnp_Params = sortObject(vnp_Params)

//     var config = require('config')

//     var secretKey = config.get('vnp_HashSecret')

//     var querystring = require('qs')

//     var signData = querystring.stringify(vnp_Params, { encode: false })

//     var crypto = require('crypto')

//     var hmac = crypto.createHmac('sha512', secretKey)

//     var signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')

//     if (secureHash === signed) {
//       var orderId = vnp_Params['vnp_TxnRef']
//       var rspCode = vnp_Params['vnp_ResponseCode']
//       //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
//       res.status(200).json({ RspCode: '00', Message: 'success' })
//     } else {
//       res.status(200).json({ RspCode: '97', Message: 'Fail checksum' })
//     }
//   }
// }
import { Order } from '#model'
import qs from 'query-string'
import crypto from 'crypto'

export default class PaymentController {
  constructor() {}
  createLinkPayment = async (params) => {
    try {
      let { createDate, orderId, amount, orderInfo } = params

      let vnp_Params = this.getVpnParams({ createDate, orderId, amount, orderInfo })

      var vnpUrl = process.env.VNPAY_URL_PAYMENT

      vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false })

      // Start Transaction

      return { url: vnpUrl, status: true }
    } catch (err) {
      console.log('paymentOrder', err)
      throw {
        error: err,
        status: false,
      }
    }
  }

  getVpnParams = (params) => {
    try {
      let { createDate, orderId, amount, orderInfo, ip } = params

      var tmnCode = process.env.VNPAY_TMNCODE

      var secretKey = process.env.VNPAY_SECRET

      var returnUrl = `${process.env.API}/api/service/payment/url_return`

      var orderType = 'billpayment'

      var locale = 'vn'

      var vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: tmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: 'VND',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: orderType,
        vnp_Amount: amount,
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ip,
        vnp_CreateDate: createDate,
      }

      vnp_Params = this.sortObject(vnp_Params)

      var signData = qs.stringify(vnp_Params, { encode: false })

      var hmac = crypto.createHmac('sha512', secretKey)

      var signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest('hex')

      vnp_Params['vnp_SecureHash'] = signed
      return vnp_Params
    } catch (error) {
      throw {
        message: 'generate Params failed',
        error,
      }
    }
  }

  sortObject = (obj) => {
    try {
      var sorted = {}
      var str = []
      var key
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          str.push(encodeURIComponent(key))
        }
      }
      str.sort()
      for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+')
      }
      return sorted
    } catch (error) {
      throw {
        message: 'sort Object failed',
        error,
      }
    }
  }
}
