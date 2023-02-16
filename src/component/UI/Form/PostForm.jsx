import { useEffect, useState } from 'react'
import { Button, Form, Panel, PanelGroup, SelectPicker } from 'rsuite'
import { KMEditor, KMInput } from '../Content/KMInput'
import CustomUpload from '../Upload/CustomUpload'

export default function PostForm({ postData, onSubmit, router, ...props }) {
  //   const formDataRef = useRef(postData)

  const [formData, setFormData] = useState(postData)

  useEffect(() => {
    setFormData(postData)
  }, [postData])

  return (
    <Form
      formValue={formData}
      className={'row p-2'}
      fluid
      onChange={(formValue) => {
        setFormData((prev) => {
          for (let key in formValue) {
            if (prev[key] !== formValue[key]) {
              prev[key] = formValue[key]
            }
          }
          return prev
        })
      }}
    >
      <div className="col-12">
        <Button appearance="primary" onClick={() => router.back()}>
          Back
        </Button>
      </div>
      <div className="col-9">
        <PanelGroup>
          <Panel header="Tiêu đề" collapsible defaultExpanded>
            <KMInput name="title" />
          </Panel>
          <Panel header="Đường dẫn" collapsible defaultExpanded>
            <KMInput name="slug" />
          </Panel>
          <Panel header="Nội dung" collapsible defaultExpanded>
            <KMEditor name="content" />
          </Panel>
          <Panel header="Mô tả" collapsible>
            <KMEditor name="description" />
          </Panel>
        </PanelGroup>
      </div>
      <div className="col-3 ">
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
      </div>
      <div className="d-flex justify-content-end col-12">
        <Form.Group>
          <Button appearance="primary" onClick={() => onSubmit(formData)}>
            Tạo mới
          </Button>
        </Form.Group>
      </div>
    </Form>
  )
}
