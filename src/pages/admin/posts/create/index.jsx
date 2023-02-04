import AdminLayout from 'component/UI/AdminLayout'
import { KMEditor, KMInput } from 'component/UI/Content/KMInput'
import Select from 'component/UI/Content/MutiSelect'
import PostForm from 'component/UI/Form/PostForm'
import CustomUpload from 'component/UI/Upload/CustomUpload'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { Button, ButtonToolbar, Content, Form, Panel, PanelGroup, useToaster } from 'rsuite'
import CategoryService from 'service/admin/Category.service'
import PostService from 'service/admin/Post.service'
import { message } from 'src/helper'
import { useCommonStore } from 'src/store/commonStore'

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
      <PostForm onSubmit={onSubmit} categoryData={categoryData} router={router}/>

      {/* <Form formValue={form} onChange={(formVal) => setForm(formVal)} className={'row'} fluid ref={formDataRef}>
        <div className="col-12">
          <Button appearance="primary" onClick={() => router.back()}>
            Back
          </Button>
        </div>
        <div className="col-10">
          <PanelGroup>
            <Panel header="Tiêu đề" collapsible defaultExpanded>
              <KMInput name="title" onChange={(v) => (formDataRef.current.title = v)} />
            </Panel>
            <Panel header="Đường dẫn" collapsible defaultExpanded>
              <KMInput name="slug" onChange={(v) => (formDataRef.current.slug = v)} />
            </Panel>
            <Panel header="Nội dung" collapsible defaultExpanded>
              <KMEditor name="content" onChange={(v) => (formDataRef.current.content = v)} />
            </Panel>
            <Panel header="Mô tả" collapsible>
              <KMEditor name="description" onChange={(v) => (formDataRef.current.description = v)} />
            </Panel>
          </PanelGroup>
        </div>
        <div className="col-2">
          <Form.Group controlId="postImg">
            <Form.ControlLabel>Ảnh bài post</Form.ControlLabel>
            <Form.Control
              rows={5}
              name="upload"
              accepter={CustomUpload}
              action={process.env.API + '/api/upload'}
              withCredentials={true}
              onSuccess={(resp, file) => setForm((prev) => ({ ...prev, image: { src: resp.url, name: file.name } }))}
              value={form?.image}
            />
          </Form.Group>

          <Form.Group controlId="category">
            <Form.ControlLabel>Danh mục</Form.ControlLabel>
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
        <div className="d-flex justify-content-end col-12">
          <Form.Group>
            <ButtonToolbar>
              <Button appearance="primary" onClick={onSubmit}>
                Tạo mới
              </Button>
            </ButtonToolbar>
          </Form.Group>
        </div>
      </Form> */}
    </Content>
  )
}

PostCreate.Admin = AdminLayout

export default PostCreate
