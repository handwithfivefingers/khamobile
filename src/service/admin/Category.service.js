import axios from 'configs/axiosInstance';

const path = {
	getCate: '/admin/category',
};

const CategoryService = {
	getCate: async () => await axios.get(path.getCate),
};

export default CategoryService;
