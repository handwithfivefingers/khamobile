import axios from 'configs/axiosInstance';

const path = {
	product: '/admin/product',
	variable: '/admin/product/variable',
};

const ProductService = {
	// getCate: async (params) => await axios.get(path.category, { params }),
	// getCateById: async (id) => await axios.get(path.category + '/' + id),
	// createCate: async (form) => await axios.post(path.category, form),

	getProduct: async () => await axios.get(path.product),
	getVariables: async () => await axios.get(path.variable),
	updateVariable: async (id, form) => await axios.post(path.variable + '/' + id, form),
	createVariable: async (form) => await axios.post(path.variable, form),
};

export default ProductService;
