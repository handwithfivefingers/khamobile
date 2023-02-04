import axios from 'configs/axiosInstance'

const path = {
  post: '/admin/post',
}

const PostService = {
  getPosts: () => axios.get(path.post),
  createPost: (form) => axios.post(path.post, form),
  getSinglePost: (_id) => axios.get(path.post + '/' + _id),
  //   updatePage: (_id, formData) => axios.post(path.post + '/' + _id, formData),
  //   createPage: (formData) => axios.post(path.post, formData),
  //   getPageById: (id) => axios.get(path.post + '/' + id),
}

export default PostService
