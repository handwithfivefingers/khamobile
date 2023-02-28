import mongoose from 'mongoose'

export default {
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  slug: {
    type: String,
    required: true,
  },
  content: [
    {
      section_name: String,
      title: String,
      type: {
        type: String,
        enum: ['Image', 'HomeSlider', 'ImageSlider', 'ProductCategory', 'Product'],
      },
      // dynamicRef: {
      //   type: String,
      //   enum: ['Product', 'ProductCategory'],
      // },
      data: [
        // {
        //   type: mongoose.Schema.Types.ObjectId,
        //   refPath: 'content.dynamicRef',
        // },
      ],
      options: {
        moreLink: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductCategory',
          },
        ],
        max: String,
        showTitle: Boolean,
      },
    },
    /**
     * chia theo `section_` để quản lý : Example: section_1 , section_2
     * trong mỗi `section_` sẽ chia ra bao gồm: title, type, và data
     * type bao gồm: multiple ( dynamic increament), single ( single input)
     * sau này sẽ add thêm
     */
  ],
}
