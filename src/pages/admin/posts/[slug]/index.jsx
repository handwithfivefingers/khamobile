import AdminLayout from 'component/UI/AdminLayout'
import { KMInput } from 'component/UI/Content/KMInput'
import Select from 'component/UI/Content/MutiSelect'
import Textarea from 'component/UI/Editor'
import PostForm from 'component/UI/Form/PostForm'
import CustomUpload from 'component/UI/Upload/CustomUpload'
import axios from 'configs/axiosInstance'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { Button, ButtonToolbar, Content, Form } from 'rsuite'
import CategoryService from 'service/admin/Category.service'
import { useCommonStore } from 'src/store/commonStore'
import { useLoaderStore } from 'src/store/loaderStore'
import styles from './styles.module.scss'
import PostService from 'service/admin/Post.service'
const PostEdit = ({ slug }) => {
  const router = useRouter()

  const [postData, setPostData] = useState()

  const [categoryData, setCategoryData] = useState()

  const [loading, setLoading] = useState()

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

  // const resp = await PostService.getSinglePost(slug)
  // if (resp.status === 200) {
  //   const { data } = resp.data
  //   return {
  //     props: {
  //       slug,
  //       // data,
  //     },
  //   }
  // }
  return {
    props: {
      slug,
      // data,
    },
  }
  return {
    notFound: true,
  }
}

PostEdit.Admin = AdminLayout

export default PostEdit
