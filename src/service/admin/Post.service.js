import axios from 'configs/axiosInstance'

const path = {
  post: '/admin/post',
}

const PostService = {
  getPosts: () => axios.get(path.post),
  createPost: (form) => axios.post(path.post, form),
  getSinglePost: (_id) => axios.get(path.post + '/' + _id),
  updatePost: (_id, form) => axios.post(path.post + '/' + _id, form),
}

export default PostService
