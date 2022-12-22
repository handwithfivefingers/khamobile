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
    company: String,
    address_1: String,
    address_2: String,
    city: String,
    postCode: String,
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
