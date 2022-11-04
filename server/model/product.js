import mongoose from 'mongoose';
export default {
	name: {
		type: String,
		required: true,
		trim: true,
	},

	price: {
		type: Number,
		required: true,
	},

	quantity: {
		type: Number,
		required: true,
	},

	stock: {
		type: Number,
	},

	description: {
		type: String,
		trim: true,
	},
	slug: {
		type: String,
		required: true,
	},

	categories: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
		},
	],

	img: [
		{
			type: String,
		},
	],

	reviews: [
		{
			userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
			review: String,
		},
	],

	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
};
