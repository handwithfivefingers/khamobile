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

	img: {
		type: String,
	},
	parentCategory: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category',
	},
};
