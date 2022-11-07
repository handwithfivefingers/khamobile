import axios from 'configs/axiosInstance';

const path = {
	category: '/admin/category',
};

const CategoryService = {
	getCate: async () => await axios.get(path.category),
	createCate: async (form) => await axios.post(path.category, form),
};

export default CategoryService;
