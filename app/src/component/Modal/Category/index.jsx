import CardBlock from 'component/UI/Content/CardBlock'
import { KMInput } from 'component/UI/Content/KMInput'
import CustomUpload from 'component/UI/Upload/CustomUpload'
import { useRef, useState } from 'react'
import { Button, ButtonToolbar, Content, Form, Panel, PanelGroup, Schema } from 'rsuite'
import { CategoryModel } from 'src/constant/model.constant'
import Select from 'component/UI/Content/MutiSelect'
export default function Category(props) {
  const [form, setForm] = useState({})
  const formRef = useRef()

  const onFinish = () => {
    console.log(form)
  }
  return (
    <Form formValue={form} onChange={(val) => setForm(val)} ref={formRef} model={CategoryModel}>
      <div className="container">
        <div className="row">
          <div className="col-6">
            <PanelGroup>
              <Panel>
                <KMInput name="key" label="Tên thuộc tính" helpText={'Thuộc tính là bắt buộc'} />
                <KMInput name="key" label="Đường dẫn" helpText={'Đường dẫn là bắt buộc'} />
                <Form.Group>
                  <Button onClick={onFinish} appearance="primary">
                    Tạo danh mục
                  </Button>
                </Form.Group>
              </Panel>
            </PanelGroup>
          </div>
          <div className="col-6">
            <PanelGroup>
              <Panel header="Danh mục phụ thuộc" collapsible>
                <Form.Group controlId="category">
                  <Form.Control
                    name="category"
                    data={props.listCategory || []}
                    labelKey={'name'}
                    accepter={Select}
                    valueKey={'_id'}
                    preventOverflow
                    cascade
                    // onChange={(v) => (formDataRef.current.category = v)}
                  />
                </Form.Group>
              </Panel>
            </PanelGroup>
          </div>
        </div>
      </div>
    </Form>
  )
}
