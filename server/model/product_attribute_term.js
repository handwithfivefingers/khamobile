import mongoose from 'mongoose'

export default {
  name: String,
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductAttribute',
  },
}
