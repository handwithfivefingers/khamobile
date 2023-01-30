import mongoose from 'mongoose'

export default {
  price: Number,
  regular_price: Number,
  image: String,
  purchasable: {
    type: Boolean,
    default: true,
  },
  stock_status: {
    type: String,
    enum: ['outofstock', 'instock'],
    default: 'instock',
  },
  attributes: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'ProductAttributeTerm',
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
}
