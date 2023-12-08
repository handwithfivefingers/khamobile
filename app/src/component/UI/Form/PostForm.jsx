import { useEffect, useRef, useState } from 'react'
import { Button, Form, Panel, PanelGroup, SelectPicker, Placeholder } from 'rsuite'
import { KMEditor, KMInput, KMInputArea } from '../Content/KMInput'
import CustomUpload from '../Upload/CustomUpload'
// import { TinyMceEditor } from '../Editor/TinyMCE'
import dynamic from 'next/dynamic'

const TinyMceEditor = dynamic(() => import('../Editor/TinyMCE').then((m) => m.TinyMceEditor), {
  ssr: false,
  loading: () => <Placeholder.Graph active height={412} />,
})

export default function PostForm({ postData, onSubmit, router, ...props }) {
  const [formData, setFormData] = useState(postData)
  const editorRef = useRef(null)
  useEffect(() => {
    setFormData(postData)
  }, [postData])

  const handleFormValueChange = (value) => {
    setFormData(value)
  }
  const onFinish = () => {
    const content = editorRef.current.getContent()
    const value = {
      ...formData,
      content,
    }
    onSubmit(value)
  }
  console.log('render', formData)
  return (
    <Form
      formValue={formData}
      className={'grid grid-cols-4 grid-rows-[2_auto] h-full overflow-hidden ' }
      fluid
      onChange={handleFormValueChange}
    >
      <div className="col-span-4 row-span-1 ">
        <Button appearance="primary" onClick={() => router.back()}>
          Back
        </Button>
      </div>
      <div className="col-span-3 overflow-y-scroll">
        <PanelGroup>
          <Panel header="Tiêu đề" collapsible defaultExpanded>
            <KMInput name="title" />
          </Panel>
          <Panel header="Đường dẫn" collapsible defaultExpanded>
            <KMInput name="slug" />
          </Panel>
          <Panel header="Nội dung" collapsible defaultExpanded>
            <TinyMceEditor name="content" forwardRef={editorRef} />
          </Panel>
          <Panel header="Mô tả" collapsible>
            <KMInputArea name="description" />
          </Panel>
        </PanelGroup>
      </div>
      <div className="col-span-1 flex flex-col items-center">
        <Form.Group controlId="image">
          <Form.ControlLabel>Ảnh bài post</Form.ControlLabel>
          <Form.Control
            name="upload"
            accepter={CustomUpload}
            action={process.env.API + '/api/upload'}
            withCredentials={true}
            onSuccess={(resp, file) => {
              setFormData((prev) => {
                prev.image = { src: resp.url, name: file.name }
                return prev
              })
            }}
            value={formData?.image}
          />
        </Form.Group>

        <Form.Group controlId="category">
          <Form.ControlLabel>Danh mục</Form.ControlLabel>
          <Form.Control
            name="category"
            accepter={SelectPicker}
            data={[]}
            labelKey={'name'}
            valueKey={'_id'}
            preventOverflow
            cascade
          />
        </Form.Group>
        <div className="d-flex justify-content-end col-12">
          <Form.Group>
            <Button appearance="primary" onClick={onFinish}>
              Tạo mới
            </Button>
          </Form.Group>
        </div>
      </div>
    </Form>
  )
}
