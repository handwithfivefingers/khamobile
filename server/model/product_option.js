import mongoose from 'mongoose'

export default {
  variant: {},

  primaryKey: String,

  price: Number,

  slug: String,

  inStock: Boolean,

  quantity: Number,

  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
}
