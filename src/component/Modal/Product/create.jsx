import { useEffect, useState, memo } from 'react'

import CardBlock from 'component/UI/Content/CardBlock'
import { KMEditor, KMInput, KMSelect } from 'component/UI/Content/KMInput'
import Select from 'component/UI/Content/MutiSelect'
import CustomUpload from 'component/UI/Upload/CustomUpload'
import { useRouter } from 'next/router'
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Content,
  FlexboxGrid,
  Form,
  Input,
  InputNumber,
  SelectPicker,
} from 'rsuite'
import CategoryService from 'service/admin/Category.service'
import ProductService from 'service/admin/Product.service'
import { COMMON_TEXT } from 'src/constant/text.constant'
import { useCommonStore } from 'src/store/commonStore'
import { useDevStore } from 'src/store/devStore'
import GroupVariant from './GroupVariant'

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
  const changeData = useDevStore((state) => state.changeData)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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

  useEffect(() => {
    const timeout = setTimeout(() => changeData(form), 1000)
    return () => clearTimeout(timeout)
  }, [form])

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

  return (
    <>
      <Button onClick={() => router.back()}>Back</Button>

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
                <FlexboxGrid.Item>
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
                </FlexboxGrid.Item>

                {form?.type === 'simple' && (
                  <>
                    <Form.Group controlId="price" className="p-1">
                      <Form.ControlLabel>Giá tiền</Form.ControlLabel>
                      <Form.Control accepter={InputNumber} name="price" />
                    </Form.Group>
                  </>
                )}
                {form?.type === 'variable' && (
                  <FlexboxGrid.Item style={{ width: '100%' }}>
                    <GroupVariant attributes={variable} />
                    {/* <Form.Group controlId="primary" className="p-1">
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
                    </FlexboxGrid.Item> */}
                  </FlexboxGrid.Item>
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
                <Form.ControlLabel>Ảnh bài post</Form.ControlLabel>

                <Form.Control
                  rows={5}
                  name="upload"
                  accepter={CustomUpload}
                  group
                  action={process.env.API + '/api/upload'}
                  onSuccess={(resp, file) => {
                    setForm({
                      ...form,
                      image: form.image
                        ? [...form.image, { src: resp.url, name: file.name }]
                        : [{ src: resp.url, name: file.name }],
                    })
                  }}
                  value={form.image}
                />
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

export default memo(ProductCreateModal)
