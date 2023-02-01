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
    enum: ['pending', 'completed'],
    default: 'pending',
    require: true,
  },

  product: [
    {
      variantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductVariant',
      },
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],

  createDate: String,

  orderId: String,
}
