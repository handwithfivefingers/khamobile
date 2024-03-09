import mongoose from 'mongoose'
import { TYPE_VARIANT } from '#constant/type'
export default {
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  content: String,
  price: Number,
  primary: String,
  information: [],
  slug: {
    type: String,
    required: true,
  },
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductCategory',
    },
  ],
  stock_status: {
    type: String,
    enum: ['outofstock', 'instock'],
    default: 'instock',
  },
  purchasable: {
    type: Boolean,
    default: true,
  },
  image: [
    {
      src: String,
      name: String,
    },
  ],
  type: {
    type: String,
    enum: [TYPE_VARIANT.SIMPLE, TYPE_VARIANT.VARIANT],
    default: TYPE_VARIANT.SIMPLE,
  },
  attributes: [
    {
      name: String,
      value: Array,
    },
  ],
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      review: String,
    },
  ],
}
