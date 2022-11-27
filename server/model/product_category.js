import mongoose from 'mongoose'

export default {
  id: Number,
  name: String,
  slug: {
    type: String,
    indexedDB: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory',
  },
  description: String,
  image: String,
}
