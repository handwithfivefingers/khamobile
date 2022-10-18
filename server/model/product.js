const mongoose = require("mongoose");


module.exports = {
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true,
    min: 3,
  },
  price: {
    type: Number,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  parentId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  type: {
    type: String,
    required: true,
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
};