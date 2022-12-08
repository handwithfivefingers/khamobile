import React, { useEffect, useState } from 'react'

import MinusIcon from '@rsuite/icons/Minus'
import PlusIcon from '@rsuite/icons/Plus'
import CardBlock from 'component/UI/Content/CardBlock'
import Select from 'component/UI/Content/MutiSelect'
import CustomUpload from 'component/UI/CustomUpload'
import UploadLink from 'component/UI/LinkUpload'
import Textarea from 'component/UI/Editor'
import JsonViewer from 'component/UI/JsonViewer'
import _ from 'lodash'
import { useRouter } from 'next/router'
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Content,
  FlexboxGrid,
  Form,
  IconButton,
  SelectPicker,
  InputNumber,
  Input,
  Toggle,
  TagInput,
} from 'rsuite'
import CategoryService from 'service/admin/Category.service'
import ProductService from 'service/admin/Product.service'
import { useCommonStore } from 'src/store/commonStore'
import { KMEditor, KMInput, KMSelect } from 'component/UI/Content/KMInput'
import { COMMON_TEXT } from 'src/constant/text.constant'

const CustomInput = (props) => {
  return <input name="title" className="rs-input" type="text" {...props} />
}

const VariantControl = (props) => {
  console.log(props)
  let { value, variable, onChange } = props

  const [list, setList] = useState(value)

  const add = () => {
    let next = [...list]
    next.push({
      attributes: {
        'Dung lượng': '1TB',
        'Màu sắc': 'Black',
        'Phiên bản': 'LNE',
      },
      price: 0,
      regular_price: 0,
    })
    setList(next)
  }

  const handleMinus = () => {
    setList(list.slice(0, -1))
  }

  const handleSelect = (value, index, field) => {
    console.log(value, index)
    let next = [...list]
    next[index].attributes[field] = value
    setList(next)

    onChange(next)
  }

  const handeInput = (value, index, field) => {
    let next = [...list]
    next[index][field] = value
    setList(next)
    onChange(next)
  }

  return (
    <FlexboxGrid>
      <FlexboxGrid.Item style={{ width: '100%' }}>
        <FlexboxGrid>
          {list.map(({ _id, purchasable, stock_status, ...item }, index) => {
            return (
              <>
                {Object.keys(item).map((key) => {
                  if (key === 'attributes') {
                    return variable.map((vars) => {
                      return (
                        <FlexboxGrid.Item className="p-1" style={{ width: '20%' }}>
                          <Form.ControlLabel>{vars._id}</Form.ControlLabel>
                          <SelectPicker
                            data={vars.item.map((v) => ({ label: v.name, value: v.name }))}
                            onChange={(value) => handleSelect(value, index, vars._id)}
                            placeholder={vars._id}
                            style={{ width: '100%' }}
                            value={item[key][vars._id]}
                          />
                        </FlexboxGrid.Item>
                      )
                    })
                  } else {
                    return (
                      <FlexboxGrid.Item className="p-1" style={{ width: '20%' }}>
                        <Form.ControlLabel>{COMMON_TEXT[key]} </Form.ControlLabel>
                        <Input
                          placeholder={key}
                          onChange={(value) => handeInput(value, index, key)}
                          value={list[index][key]}
                          style={{ width: '100%' }}
                        />
                      </FlexboxGrid.Item>
                    )
                  }
                })}
              </>
            )
          })}
        </FlexboxGrid>
      </FlexboxGrid.Item>

      <FlexboxGrid.Item style={{ width: '100%' }}>
        <Button onClick={add}>Add</Button>
        <Button onClick={handleMinus}>Remove</Button>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  )
}

const ProductCreateModal = (props) => {
  const changeTitle = useCommonStore((state) => state.changeTitle)
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [toggleUpload, setToggleUpload] = useState(true)

  const [variable, setVariable] = useState([])

  const [form, setForm] = useState({
    price: 0,
    regular_price: 0,
    purchasable: true,
    stock_status: true,
    parentId: '',
    variations: [],
    category: [],
    ...props?.data,
  })

  const [cate, setCate] = useState()

  useEffect(() => {
    getVariables()
    getCategory()
    changeTitle('Create Post')
  }, [])

  const getVariables = async () => {
    try {
      setLoading(true)

      let resp = await ProductService.getAttribute()

      let _variables = resp.data.data

      setVariable(_variables)
    } catch (error) {
      console.log('getVariables error', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategory = async () => {
    try {
      setLoading(true)

      let resp = await CategoryService.getProdCate()

      let category = resp.data.data

      setCate(category)
    } catch (error) {
      console.log('getVariables error', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async () => {
    try {
      setLoading(true)
      if (props.onSubmit) {
        props.onSubmit(form)
      }
    } catch (error) {
      console.log('error', error, error?.response?.data?.message)
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setLoading(false)
    }
  }

  console.log(toggleUpload)

  return (
    <>
      <Button onClick={() => router.back()}>Back</Button>

      <JsonViewer data={form} />

      <Content className={'p-4'}>
        <Form formValue={form} onChange={(formVal) => setForm(formVal)} className={'row gx-2 '} fluid>
          <div className="col-9 bg-w rounded " style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <CardBlock>
              <KMInput name="title" label="Tên sản phẩm" />

              <KMInput name="slug" label="Đường dẫn" />

              <KMEditor name="content" label="Nội dung" />

              <KMEditor name="description" label="Mô tả" />
            </CardBlock>

            <CardBlock>
              <FlexboxGrid>
                <Form.Group controlId="type" className="p-1">
                  <Form.ControlLabel>Loại biến thể</Form.ControlLabel>
                  <SelectPicker
                    name="type"
                    onChange={(value) => setForm({ ...form, type: value })}
                    data={[
                      { label: 'Đơn giản', value: 'simple' },
                      { label: 'Nhiều biến thể', value: 'variable' },
                    ]}
                    value={form['type']}
                  />
                </Form.Group>

                {form?.type === 'simple' && (
                  <>
                    <Form.Group controlId="price" className="p-1">
                      <Form.ControlLabel>Giá tiền</Form.ControlLabel>
                      <Form.Control accepter={InputNumber} name="price" />
                    </Form.Group>
                  </>
                )}
                {form?.type === 'variable' && (
                  <>
                    <Form.Group controlId="primary" className="p-1">
                      <Form.ControlLabel>Thuộc tính chính</Form.ControlLabel>
                      <Form.Control
                        name="primary"
                        accepter={KMSelect}
                        data={variable?.map((item) => ({ label: item._id, value: item._id }))}
                        style={{ width: '100%' }}
                        placeholder="Khóa chính"
                        value={form['primary']}
                      />
                    </Form.Group>
                    <FlexboxGrid.Item style={{ width: '100%' }}>
                      <Form.Group controlId="variations">
                        <Form.Control name="variations" accepter={VariantControl} variable={variable} />
                      </Form.Group>
                    </FlexboxGrid.Item>
                  </>
                )}
              </FlexboxGrid>
            </CardBlock>
          </div>
          <div
            className="col-3 position-sticky "
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              top: 0,
            }}
          >
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
                  <Form.Control rows={5} name="img" accepter={CustomUpload} action="#" group />
                ) : (
                  // <Form.Control rows={5} name="img" accepter={UploadByLink} action="#" group />
                  <UploadLink onChange={(value, item) => setForm({ ...form, img: value })} />
                )}
              </Form.Group>
            </CardBlock>

            <CardBlock>
              <Form.Group controlId="category">
                <Form.ControlLabel>Danh mục cha</Form.ControlLabel>
                <Form.Control
                  name="category"
                  data={cate || []}
                  labelKey={'name'}
                  accepter={Select}
                  valueKey={'_id'}
                  preventOverflow
                  cascade
                />
              </Form.Group>
            </CardBlock>

            <CardBlock>
              <Form.Group>
                <ButtonToolbar>
                  <Button appearance="primary" onClick={onSubmit}>
                    Tạo
                  </Button>
                </ButtonToolbar>
              </Form.Group>
            </CardBlock>
          </div>
        </Form>
      </Content>
    </>
  )
}

export default ProductCreateModal
