import mongoose from 'mongoose'

export default {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  userInformation: {
    fullName: String,
    phone: String,
    email: String,
  },

  deliveryInformation: {
    city: String,
    district: String,
    wards: String,
    address: String,
  },

  deliveryType: {
    type: String,
  },

  paymentType: {
    type: String,
    enum: ['transfer', 'vnpay', 'baokim'],
    default: 'transfer',
  },

  amount: {
    type: Number,
    require: true,
  },

  status: {
    type: String,
    enum: ['pending', 'failed', 'completed'],
    default: 'pending',
    require: true,
  },

  product: [
    {
      variantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductVariant',
      },
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        default: 1,
      },
      image: {
        src: String,
      },
    },
  ],

  orderInfo: {},

  createDate: String,

  orderId: String,
}
