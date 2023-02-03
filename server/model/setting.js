import mongoose from 'mongoose'

export default {
  title: {
    type: String,
    required: true,
  },

  template: [
    {
      templateName: String,
      templateCode: Number,
    },
  ],

  menu: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'menu.dynamicRef',
      },
      
      dynamicRef: {
        type: String,
        enum: ['Page', 'Post', 'Product', 'ProductVariant', 'ProductCategory', 'Category'],
      },

      parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'menu.dynamicRef',
      },

    },
  ],

  logo: {},
}
