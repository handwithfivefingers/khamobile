import axios from 'configs/axiosInstance';

const path = {
	getUser: '/admin/user',
};

const UserService = {
	getUser: async () => await axios.get(path.getUser),
};

export default UserService;
