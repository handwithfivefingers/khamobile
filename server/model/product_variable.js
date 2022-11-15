export default {
	key: String,
	value: [String],
	delete: {
		type: Number,
		enum: [0, 1],
		default: 0,
	},
};
