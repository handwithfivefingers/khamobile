import AdminLayout from 'component/UI/AdminLayout'
import PostForm from 'component/UI/Form/PostForm'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Content } from 'rsuite'
import CategoryService from 'service/admin/Category.service'
import PostService from 'service/admin/Post.service'
const PostEdit = ({ slug }) => {
  const router = useRouter()

  const [postData, setPostData] = useState()

  const [categoryData, setCategoryData] = useState()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getCateData()
    getPostData()
  }, [])

  const getCateData = async () => {
    try {
      const res = await CategoryService.getCate({ type: 'post' })
      let { data } = res.data
      setCategoryData(data)
    } catch (error) {
      console.log('error', error, error?.response?.data?.message)
    }
  }

  const getPostData = async () => {
    try {
      const resp = await PostService.getSinglePost(slug)
      setPostData(resp.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const onSubmit = async ({ _id, ...value }) => {
    try {
      await PostService.updatePost(_id, value)
      console.log('ready for ')
    } catch (error) {
      console.log('error', error, error?.response?.data?.message)
    }
  }

  return (
    <Content className={'bg-w'}>
      {postData && <PostForm postData={postData} onSubmit={onSubmit} router={router} />}
    </Content>
  )
}

export const getServerSideProps = async (ctx) => {
  const { slug } = ctx.query

  return {
    props: {
      slug,
    },
  }
  return {
    notFound: true,
  }
}

PostEdit.Admin = AdminLayout

export default PostEdit
