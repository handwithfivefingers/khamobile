import AdminLayout from 'component/UI/AdminLayout'
import PostForm from 'component/UI/Form/PostForm'
import { useEffect, useState } from 'react'
import { Content, useToaster } from 'rsuite'
import CategoryService from 'service/admin/Category.service'
import PostService from 'service/admin/Post.service'
import { message } from 'src/helper'
import { useCommonStore } from 'src/store'

const PostCreate = () => {
  const changeTitle = useCommonStore((state) => state.changeTitle)

  const [categoryData, setCategoryData] = useState()

  const toaster = useToaster()

  useEffect(() => {
    document.title = 'Tạo bài viết - Khamobile - Truyenmai'
    changeTitle('Tạo bài viết mới')
    getCateData()
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

  const onSubmit = async (value) => {
    try {
      const resp = await PostService.createPost(value)
      toaster.push(message('success', resp.data.message), { placement: 'topEnd' })
    } catch (error) {
      toaster.push(message('error', error?.response?.data?.message || error?.response?.message || error?.message), {
        placement: 'topEnd',
      })
      console.log('error', error, error?.response?.data?.message)
    }
  }

  return (
    <Content className={'bg-w p-2 shadow'}>
      <PostForm onSubmit={onSubmit} categoryData={categoryData} router={router} />
    </Content>
  )
}

PostCreate.Admin = AdminLayout

export default PostCreate
