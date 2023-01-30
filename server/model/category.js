// const mongoose = require('mongoose');
import mongoose from 'mongoose';
export default {
	name: {
		type: String,
		required: true,
		min: 3,
	},
	description: {
		type: String,
		min: 3,
	},
	slug: {
		type: String,
		required: true,
		index: true,
		unique: true,
	},

	categoryImg: [
		{
			filename: {
				type: String,
			},
		},
	],

	type: {
		type: String,
		enum: ['product', 'category', 'post'],
		default: 'category',
	},

	parentCategory: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category',
	},
};
