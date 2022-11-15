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

	quantity: Number,

	stock: Number,

	description: String,

	content: String,

	variable: [],
	
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
