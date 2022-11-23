import mongoose from 'mongoose'

export default {
  // variant: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "ProductVariable",
  // },
  // productId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Product",
  // },
  // pricing: {
  //   type: Number,
  // },
  // inStock: {
  //   type: Boolean,
  // },
  variant: {},
  primaryKey: String,
  price: {
    type: Number,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
}
