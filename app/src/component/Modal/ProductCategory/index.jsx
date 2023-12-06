import CardBlock from 'component/UI/Content/CardBlock'
import { KMInput } from 'component/UI/Content/KMInput'
import JsonViewer from 'component/UI/JsonViewer'
import CustomUpload from 'component/UI/Upload/CustomUpload'
import { useRef, useState, useEffect } from 'react'
import { Button, ButtonToolbar, Content, Form, Input, Schema, Toggle } from 'rsuite'

export default function ProductCategory(props) {
  const [form, setForm] = useState(props?.data)
  const [toggleUpload, setToggleUpload] = useState(true)
  const [render, setRender] = useState(false)
  const formRef = useRef()

  const onSubmit = () => {
    if (!formRef.current.check()) {
      console.error('Form Error')
      return
    }
    props?.onSubmit({ ...form })
  }

  const model = Schema.Model({
    name: Schema.Types.StringType()
      .isRequired('Tên danh mục là bắt buộc')
      .minLength(3, 'Tên danh mục thấp hơn 3 kí tự'),
    slug: Schema.Types.StringType().isRequired('Đường dẫn là bắt buộc'),
  })

  return (
    <Content className={' p-4'}>
      <Form
        formValue={form}
        onChange={(formVal) => setForm((prev) => ({ ...prev, ...formVal }))}
        className={'row gx-2 gy-2 '}
        fluid
        ref={formRef}
        model={model}
      >
        {/* <div className="col-12">
          <JsonViewer data={form} />
        </div> */}

        <div className="col-8">
          <CardBlock>
            <KMInput name="name" label="Tên danh mục" />
            <KMInput name="slug" label="đường dẫn" />
            <KMInput name="description" label="Mô tả" />
          </CardBlock>
        </div>

        <div className="col-4 d-flex flex-column">
          <CardBlock>
            <Form.Group controlId="img">
              <Form.ControlLabel>Ảnh bài post</Form.ControlLabel>
              <Form.Control
                rows={5}
                name="upload"
                accepter={CustomUpload}
                action={process.env.API + '/api/upload'}
                withCredentials={true}
                onSuccess={(resp, file) => {
                  setRender(!render)
                  setForm((prev) => ({ ...prev, image: { src: resp.url, name: file.name } }))
                }}
                value={form?.image}
              />
            </Form.Group>
          </CardBlock>

          <Form.Group
            className="d-flex justify-content-end mt-2 align-items-end"
            style={{ flex: 1, marginTop: 'auto ' }}
          >
            <ButtonToolbar>
              <Button appearance="primary" onClick={onSubmit} className="py-2 px-4">
                Edit
              </Button>
            </ButtonToolbar>
          </Form.Group>
          {/* </CardBlock> */}
        </div>
      </Form>
    </Content>
  )
}
