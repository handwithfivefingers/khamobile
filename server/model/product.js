import mongoose from "mongoose";
export default {
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
  },

  content: {
    type: String,
  },
  type: {
    type: String,
    enum: ["simple", "variant"],
    default: ["simple"],
  },
  price: {
    type: Number,
    required: true,
  },

  quantity: {
    type: Number,
  },

  slug: {
    type: String,
    required: true,
  },

  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],

  img: [
    {
      src: String,
    },
  ],

  variable: [],

  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      review: String,
    },
  ],
};
