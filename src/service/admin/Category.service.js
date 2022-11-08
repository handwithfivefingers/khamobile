import axios from 'configs/axiosInstance';

const path = {
	category: '/admin/category',
};

const CategoryService = {
	getCate: async (params) => await axios.get(path.category, { params }),
	getCateById: async (id) => await axios.get(path.category + '/' + id),
	createCate: async (form) => await axios.post(path.category, form),
};

export default CategoryService;
