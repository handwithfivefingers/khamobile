import { Order } from '#model'
export default class OrderAdmin {
  PAGE_SIZE = 10

  constructor() {}

  getOrders = async (req, res) => {
    try {
      const _order = await Order.find({})

      return res.status(200).json({
        data: _order,
        message: 'Lấy danh sách order thành công',
      })
    } catch (error) {
      return res.status(400).json({
        message: 'Something went wrong',
        error,
      })
    }
  }
}
