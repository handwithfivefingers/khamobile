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
import { ResponseCode } from '#common/ResponseCode'
import Response from '#server/response'

export default class PaymentController {
  constructor() {}

  createLinkPayment = async ({ createDate, orderId, amount, orderInfo, ip }) => {
    try {
      let vnp_Params = this.getVpnParams({ createDate, orderId, amount: +amount * 100, orderInfo, ip })
      var vnpUrl = process.env.VNPAY_URL_PAYMENT
      vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false })

      return { url: vnpUrl, status: true, orderInfo: vnp_Params }
    } catch (err) {
      console.log('paymentOrder', err)
      throw {
        error: err,
        status: false,
      }
    }
  }

  onHandleReturnUrl = async (req, res) => {
    try {
      var vnp_Params = req.query

      var secureHash = vnp_Params['vnp_SecureHash']

      delete vnp_Params['vnp_SecureHash']

      delete vnp_Params['vnp_SecureHashType']

      vnp_Params = this.sortObject(vnp_Params)

      var tmnCode = process.env.VNPAY_TMNCODE

      var secretKey = process.env.VNPAY_SECRET

      var signData = qs.stringify(vnp_Params, { encode: false })

      var hmac = crypto.createHmac('sha512', secretKey)

      var signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest('hex')

      const url =
        process.env.NODE_ENV === 'development'
          ? `http://localhost:3002/checkout/${vnp_Params['vnp_OrderInfo']}?`
          : `https://khamobile.vn/checkout/${vnp_Params['vnp_OrderInfo']}?`

      // http://localhost:3005/api/service/payment/url_return?vnp_Amount=3760000000&vnp_BankCode=NCB&vnp_BankTranNo=VNP13916831&vnp_CardType=ATM&vnp_OrderInfo=63abc7c2b12084687be9fa6e&vnp_PayDate=20221228113712&vnp_ResponseCode=00&vnp_TmnCode=KHAMOBIL&vnp_TransactionNo=13916831&vnp_TransactionStatus=00&vnp_TxnRef=113619&vnp_SecureHash=a7bb99edb41900f46328f57ce1e0c8b2b5aef936cdc5d49ab6df501df16ba2b5b15c49ab20e77d0c931c64b3b48bf13d3b8430f010891c1af1b53d46ae1103f5

      if (secureHash === signed) {
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
        let code = vnp_Params['vnp_ResponseCode']
        const query = qs.stringify({
          code,
          text: ResponseCode[code],
        })

        if (code === '00') {
          return res.redirect(url + query)
        }
        return res.redirect(url + query)
      } else {
        const query = qs.stringify({
          code: ResponseCode[97],
        })
        return res.redirect(url + query)
      }
    } catch (error) {
      return res.redirect(process.env.HOST + '/404')
    }
  }

  getUrlIpn = async (req, res) => {
    // console.log(req.query, " Get URL Return");
    try {
      let vnp_Params = req.query

      let secureHash = vnp_Params['vnp_SecureHash']

      delete vnp_Params['vnp_SecureHash']

      delete vnp_Params['vnp_SecureHashType']

      vnp_Params = this.sortObject(vnp_Params)

      let tmnCode = process.env.VNPAY_TMNCODE

      let secretKey = process.env.VNPAY_SECRET

      let signData = qs.stringify(vnp_Params, { encode: false })

      let hmac = crypto.createHmac('sha512', secretKey)

      let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest('hex')

      const orderId = vnp_Params['vnp_OrderInfo']

      const url =
        process.env.NODE_ENV === 'development'
          ? `http://localhost:3002/checkout/${orderId}?`
          : `https://khamobile.vn/checkout/${orderId}?`

      if (secureHash === signed) {
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
        let code = vnp_Params['vnp_ResponseCode']

        let _order = await Order.findOne({
          _id: vnp_Params.vnp_OrderInfo,
          'orderInfo.vnp_TxnRef': vnp_Params.vnp_TxnRef,
        })
        // FIRST STEP - Order Exists

        if (!_order) return res.status(200).json({ RspCode: '01', Message: ResponseCode['01'] })

        let isMatchAmount = +_order.amount * 100 === +vnp_Params.vnp_Amount

        if (!isMatchAmount) return res.status(200).json({ RspCode: '04', Message: ResponseCode['04'] })

        if (_order.status === 'completed') return res.status(200).json({ RspCode: '02', Message: ResponseCode['02'] })

        if (vnp_Params['vnp_ResponseCode'] === '00' && vnp_Params['vnp_TransactionStatus'] === '00') {
          _order.status = 'completed'
          _order.orderInfo = vnp_Params
          await _order.save()
        }
        return res.status(200).json({ Message: 'Confirm Success', RspCode: '00' })
      }

      return res.status(200).json({ Message: 'Invalid Checksum', RspCode: '97' })
    } catch (err) {
      console.log('getUrlReturn', err)

      return res.status(400).json({
        RspCode: '99',
        Message: ResponseCode['99'],
        error,
      })
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
