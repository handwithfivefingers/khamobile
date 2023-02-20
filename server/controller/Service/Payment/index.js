import { Order } from '#model'
import qs from 'query-string'
import crypto from 'crypto'
import { ResponseCode } from '#common/ResponseCode'
import Response from '#server/response'
import { STATUS_ORDER } from '#constant/type'

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

      const respCode = vnp_Params['vnp_ResponseCode']
      const respTrans = vnp_Params['vnp_TransactionStatus']
      if (secureHash === signed) {
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
        let _order = await Order.findOne({
          _id: vnp_Params.vnp_OrderInfo,
          'orderInfo.vnp_TxnRef': vnp_Params.vnp_TxnRef,
        })

        // FIRST STEP - Order Exists

        if (!_order) return res.status(200).json({ RspCode: '01', Message: ResponseCode['01'] })

        let isMatchAmount = +_order.amount * 100 === +vnp_Params.vnp_Amount

        if (!isMatchAmount) return res.status(200).json({ RspCode: '04', Message: ResponseCode['04'] })

        if (_order.status !== STATUS_ORDER[1])
          return res.status(200).json({ RspCode: '02', Message: ResponseCode['02'] })

        if (respCode === '00' && respTrans === '00') {
          _order.status = STATUS_ORDER[3]
          _order.orderInfo = vnp_Params
          await _order.save()
        } else if (respCode !== '00' && respTrans !== '00') {
          _order.status = STATUS_ORDER[2]
          _order.orderInfo = vnp_Params
          await _order.save()
        }

        return res.status(200).json({ Message: ResponseCode['00'], RspCode: '00' })
      }

      return res.status(200).json({ Message: ResponseCode['97'], RspCode: '97' })
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
