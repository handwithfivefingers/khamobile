// const mongoose = require('mongoose');
import mongoose from 'mongoose';
export default {
	title: {
		type: String,
		required: true,
		min: 3,
	},
	description: {
		type: String,
		min: 3,
	},
	content: {
		type: String,
	},
	slug: {
		type: String,
		required: true,
		index: true,
		unique: true,
	},
	postImg: [
		{
			filename: {
				type: String,
			},
		},
	],
	category: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
		},
	],
};
