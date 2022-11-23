import mongoose from 'mongoose'
export default {
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: String,

  content: String,

  keyVariant: [],
  spec: {
    k: String,
    v: [],
  },
  slug: {
    type: String,
    required: true,
  },

  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],

  img: [
    {
      src: String,
    },
  ],

  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      review: String,
    },
  ],
}
