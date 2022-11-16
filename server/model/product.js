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
  primary_variant: String,
  primary_value: String,
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      review: String,
    },
  ],
};
