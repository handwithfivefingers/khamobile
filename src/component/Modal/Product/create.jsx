import React, { useEffect, useState } from 'react'

import MinusIcon from '@rsuite/icons/Minus'
import PlusIcon from '@rsuite/icons/Plus'
import CardBlock from 'component/UI/Content/CardBlock'
import Select from 'component/UI/Content/MutiSelect'
import CustomUpload from 'component/UI/CustomUpload'
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
} from 'rsuite'
import CategoryService from 'service/admin/Category.service'
import ProductService from 'service/admin/Product.service'
import { useCommonStore } from 'src/store/commonStore'
import { KMEditor, KMInput, KMSelect } from 'component/UI/Content/KMInput'

const CustomInput = (props) => {
  return <input name="title" class="rs-input" type="text" {...props} />
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
          {list.map((item, index) => {
            return (
              <>
                {Object.keys(item).map((key) => {
                  if (key === 'attributes') {
                    return variable.map((vars) => {
                      return (
                        <FlexboxGrid.Item style={{ width: '20%' }}>
                          <SelectPicker
                            data={vars.item.map((v) => ({ label: v.name, value: v.name }))}
                            onChange={(value) => handleSelect(value, index, vars._id)}
                            placeholder={vars._id}
                            style={{ width: '100%' }}
                          />
                        </FlexboxGrid.Item>
                      )
                    })
                  } else {
                    return (
                      <FlexboxGrid.Item style={{ width: '20%' }}>
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

  const [variable, setVariable] = useState(new Map())

  const [form, setForm] = useState({
    price: 0,
    regular_price: 0,
    image: [],
    purchasable: true,
    stock_status: true,
    parentId: '',
    variations: [
      {
        attributes: {
          'Dung lượng': '1TB',
          'Màu sắc': 'Black',
          'Phiên bản': 'LNE',
        },
        price: 0,
        regular_price: 0,
      },
    ],
  })

  const [data, setData] = useState()

  useEffect(() => {
    changeTitle('Create Post')
    getVariables()
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

  return (
    <>
      <Button onClick={() => router.back()}>Back</Button>

      <JsonViewer data={form} />

      <Content className={' p-4'}>
        <Form formValue={form} onChange={(formVal) => setForm(formVal)} className={'row '} fluid>
          <div className="col-9 bg-w rounded" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <CardBlock>
              <KMInput name="title" label="Tên sản phẩm" />

              <KMInput name="slug" label="Đường dẫn" />

              <KMEditor name="content" label="Nội dung" />

              <KMEditor name="description" label="Mô tả" />
            </CardBlock>

            <CardBlock>
              <SelectPicker
                name="type"
                onChange={(value) => setForm({ ...form, type: value })}
                data={[
                  { label: 'simple', value: 'simple' },
                  { label: 'variant', value: 'variant' },
                ]}
              />

              {form?.type === 'simple' && <InputNumber />}
              {form?.type === 'variant' && (
                <>
                  <Form.Group controlId="primary">
                    <Form.Control
                      name="primary"
                      accepter={KMSelect}
                      data={variable.map((item) => ({ label: item._id, value: item._id }))}
                      style={{ width: '100%' }}
                      placeholder="Khóa chính"
                    />
                  </Form.Group>
                  <Form.Group controlId="variations">
                    <Form.Control name="variations" accepter={VariantControl} variable={variable} />
                  </Form.Group>
                </>
              )}
            </CardBlock>
          </div>
          <div
            className="col-3 position-sticky"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              top: 0,
            }}
          >
            <CardBlock>
              <Form.Group controlId="img">
                <Form.ControlLabel>Ảnh bài post</Form.ControlLabel>
                <Form.Control rows={5} name="img" accepter={CustomUpload} action="#" group />
              </Form.Group>
            </CardBlock>

            <CardBlock>
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
