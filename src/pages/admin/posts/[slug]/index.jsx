import AdminLayout from 'component/UI/AdminLayout'
import { KMInput } from 'component/UI/Content/KMInput'
import Select from 'component/UI/Content/MutiSelect'
import Textarea from 'component/UI/Editor'
import CustomUpload from 'component/UI/Upload/CustomUpload'
import axios from 'configs/axiosInstance'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { Button, ButtonToolbar, Content, Form } from 'rsuite'
import CategoryService from 'service/admin/Category.service'
import PostService from 'service/global/post.service'
import { useCommonStore } from 'src/store/commonStore'
import { useLoaderStore } from 'src/store/loaderStore'
import styles from './styles.module.scss'
const PostEdit = (props) => {
  const router = useRouter()

  const { loading, setLoading } = useLoaderStore((state) => state)

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    postImg: [],
    category: '',
  })

  const [data, setData] = useState()

  const scratchRef = useRef(useCommonStore.getState())
  useEffect(() => {
    useCommonStore.subscribe((state) => (scratchRef.current = state.title))
    console.log('scratchRef.current', scratchRef.current)
  }, [])

  useEffect(() => {
    // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference

    getCateData()
    setForm(props.data)
  }, [])

  const getCateData = async () => {
    try {
      const res = await CategoryService.getCate({ type: 'post' })
      let { data } = res.data
      setData(data)
    } catch (error) {
      console.log('error', error, error?.response?.data?.message)
    }
  }

  const onSubmit = async () => {
    try {
      setLoading(true)
      const formdata = new FormData()
      for (let key in form) {
        if (key === 'postImg') {
          if (form[key]?.[0]?.blobFile) {
            formdata.append(key, form[key]?.[0]?.blobFile)
          }
        } else formdata.append(key, form?.[key])
      }
      const id = form._id
      formdata.delete('_id')
      await PostService.updatePost(id, formdata)
      console.log('ready for ')
    } catch (error) {
      console.log('error', error, error?.response?.data?.message)
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setLoading(false)
    }
  }
  return (
    <>
      <Button onClick={() => router.back()}>Back</Button>
      <Content className={'bg-w p-4'}>
        <Form formValue={form} onChange={(formVal) => setForm(formVal)} className={'row'} fluid>
          <div className="col-10">
            <KMInput name="title" label="Tiêu đề" value={form.title} />

            <KMInput name="slug" label="Đường dẫn" value={form.slug} />

            <KMInput name="description" label="Mô tả" value={form.description} />

            <Form.Group controlId="content">
              <Form.ControlLabel>Nội dung</Form.ControlLabel>
              <Form.Control rows={5} name="content" accepter={Textarea} value={form.content} />
            </Form.Group>
          </div>
          <div className="col-2">
            <Form.Group controlId="postImg">
              <Form.ControlLabel>Ảnh bài post</Form.ControlLabel>
              <Form.Control
                rows={5}
                name="postImg"
                accepter={CustomUpload}
                action="#"
                file={form['postImg']?.slice(-1)}
              />
            </Form.Group>

            <Form.Group controlId="category">
              <Form.ControlLabel>Danh mục cha</Form.ControlLabel>
              <Form.Control
                name="category"
                accepter={Select}
                data={data || []}
                labelKey={'name'}
                valueKey={'_id'}
                preventOverflow
                cascade
              />
            </Form.Group>
          </div>
          <div className="col-12">
            <Form.Group>
              <ButtonToolbar>
                <Button appearance="primary" onClick={() => onSubmit()}>
                  Submit
                </Button>
                <Button appearance="default">Cancel</Button>
              </ButtonToolbar>
            </Form.Group>
          </div>
        </Form>
      </Content>
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  const { slug } = ctx.query
  const response = await axios.get(`/admin/post/${slug}`)
  return {
    props: {
      data: response.data.data,
    },
  }
}

PostEdit.Admin = AdminLayout

export default PostEdit
