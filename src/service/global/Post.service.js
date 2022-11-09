import axios from 'configs/axiosInstance';

const path = {
	post: '/admin/post',
};

const PostService = {
	getPosts: async () => await axios.get(path.post),
	getPostBySlug: async (slug) => await axios.get(path.post + '/' + slug),
	createPost: async (form) => await axios.post(path.post, form),
	updatePost: async (id, form) => await axios.post(`${path.post}/${id}`, form),
};

export default PostService;
