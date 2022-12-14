import CardBlock from 'component/UI/Content/CardBlock'
import { KMInput } from 'component/UI/Content/KMInput'
import JsonViewer from 'component/UI/JsonViewer'
import CustomUpload from 'component/UI/Upload/CustomUpload'
import { useRef, useState, useEffect } from 'react'
import { Button, ButtonToolbar, Content, Form, Input, Schema, Toggle } from 'rsuite'

export default function ProductCategory(props) {
  const [form, setForm] = useState(props?.data)
  const [toggleUpload, setToggleUpload] = useState(true)
  const formRef = useRef()

  const onSubmit = () => {
    if (!formRef.current.check()) {
      console.error('Form Error')
      return
    }
    props?.onSubmit({ ...form})
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
        onChange={(formVal) => setForm(formVal)}
        className={'row gx-2 gy-2 '}
        fluid
        ref={formRef}
        model={model}
      >
        <div className="col-12">
          <JsonViewer data={form} />
        </div>

        <div className="col-8">
          <CardBlock>
            <KMInput name="name" label="Tên danh mục" />
            <KMInput name="slug" label="đường dẫn" />
            <KMInput name="description" label="Mô tả" />
          </CardBlock>
        </div>

        <div className="col-4">
          <CardBlock>
            <Form.Group controlId="img">
              <Form.ControlLabel>
                Ảnh bài post
                <Toggle
                  className="px-2"
                  checkedChildren="Uploader"
                  unCheckedChildren="URL Link"
                  checked={toggleUpload}
                  onChange={(val) => {
                    setToggleUpload(val)
                    setForm({ ...form, img: [] })
                  }}
                />
              </Form.ControlLabel>

              {toggleUpload ? (
                <Form.Control
                  rows={5}
                  name="image"
                  accepter={CustomUpload}
                  value={form['image']}
                  shouldUpload={() => false}
                />
              ) : (
                <Input onChange={(value, item) => setForm({ ...form, image: value })} value={form['image']} />
              )}
            </Form.Group>
          </CardBlock>

          <CardBlock className="mt-2 ">
            <Form.Group className="d-flex justify-content-end">
              <ButtonToolbar>
                <Button appearance="primary" onClick={onSubmit} className="py-2 px-4">
                  Edit
                </Button>
              </ButtonToolbar>
            </Form.Group>
          </CardBlock>
        </div>
      </Form>
    </Content>
  )
}
