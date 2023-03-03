import { Order } from '#model'
import moment from 'moment'
export default class OrderAdmin {
  PAGE_SIZE = 10

  constructor() {}

  getOrders = async (req, res) => {
    try {
      const _order = await Order.find({})
        .populate({
          path: 'product._id',
          select: 'title price attributes',
        })
        .populate({
          path: 'product.variantId',
          select: 'title price attributes',
        })
        .sort({
          createdAt: -1,
        })

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

  getOrderByChart = async (req, res) => {
    try {
      let _order = await Order.find({}).sort({ createdAt: -1 })

      const labels = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
      //
      // const labelChart = {
      //   labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
      //   datasets: [
      //     {
      //       label: '# of đơn hàng',
      //       data: [12, 19, 3, 5, 2, 3],
      //       borderWidth: 1,
      //     },
      //   ],
      // }

      const result = _order.reduce(
        (prev, { _doc: current }) => {
          let date = moment(current.createdAt).format('MM')
          let index = labels.findIndex((month) => month === date)
          if (index !== -1) {
            let increasement = ++prev[index]
            prev[index] = increasement || 1
          }
          return prev
        },
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      )

      // console.log(result)

      // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      // datasets: [
      //   {
      //     label: '# of Votes',
      //     data: [12, 19, 3, 5, 2, 3],
      //     borderWidth: 1,
      //   },
      // ],
      // console.log(result)

      res.status(200).json({
        data: result,
      })
    } catch (error) {
      console.log(error)
      return res.status(400).json({
        message: 'Something went wrong',
        error,
      })
    }
  }
}
