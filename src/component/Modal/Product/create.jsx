import React, { useEffect, useState } from 'react'

import MinusIcon from '@rsuite/icons/Minus'
import PlusIcon from '@rsuite/icons/Plus'
import CardBlock from 'component/UI/Content/CardBlock'
import Select from 'component/UI/Content/MutiSelect'
import CustomUpload from 'component/UI/CustomUpload'
import Textarea from 'component/UI/Editor'
import JsonViewer from 'component/UI/JsonViewer'
import { useRouter } from 'next/router'
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Content,
  FlexboxGrid,
  Form,
  IconButton,
  Input,
  InputNumber,
  SelectPicker,
  useToaster,
  Message,
} from 'rsuite'
import CategoryService from 'service/admin/Category.service'
import { useCommonStore } from 'src/store/commonStore'
import ProductService from 'service/admin/Product.service'
import { TEXT, PRODUCT_TEXT } from 'src/constant/text.constant'
import { forwardRef } from 'react'
import { PRODUCT_TYPE } from 'src/constant/select.constant'
import { formatCurrency } from 'src/helper'
import { NumericFormat } from 'react-number-format'
import { KMSelect } from 'component/UI/Content/KMInput'
import { useCallback } from 'react'
import _ from 'lodash'
const CustomInput = (props) => {
  return <input name="title" class="rs-input" type="text" {...props} />
}

const CustomInputPrice = ({ rowValue, onChange, name, ...props }) => {
  return (
    <NumericFormat
      name={name}
      customInput={CustomInput}
      thousandSeparator=","
      onValueChange={({ value }, sourceInfo) => onChange(value)}
      placeholder="Giá tiền"
      suffix=" VNĐ"
      value={rowValue[name]}
      {...props}
    />
  )
}

const VariableItem = ({ rowValue = {}, onChange, rowIndex, variable }) => {
  const handleChange = (value, name) => onChange(rowIndex, { ...rowValue, [name]: value })
  return (
    <>
      {Object.keys(variable).map((key, index) => {
        return (
          <FlexboxGrid.Item style={{ width: 'calc(100% / 3 - 4px)' }} key={[key, index]}>
            <SelectPicker
              value={rowValue[key]}
              placeholder={TEXT[key]}
              data={variable[key]?.map((item) => ({
                value: item,
                label: item,
              }))}
              onChange={(value) => handleChange(value, key)}
              style={{ width: '100%' }}
            />
          </FlexboxGrid.Item>
        )
      })}
    </>
  )
}

const VariantInput = ({ value, onChange, data, variable, ...rest }) => {
  const [products, setProducts] = React.useState(value)

  const [primaryKey, setPrimaryKey] = useState('')

  const handleChangeProducts = (nextProducts) => {
    setProducts(nextProducts)
    onChange(nextProducts)
  }
  const handleInputChange = (rowIndex, value) => {
    const nextProducts = [...products]
    nextProducts[rowIndex] = value
    handleChangeProducts(nextProducts)
  }

  const handleMinus = () => {
    handleChangeProducts(products.slice(0, -1))
  }

  const handleAdd = () => {
    let VariantObject = {
      k: primaryKey || '',
      v: '',
    }

    handleChangeProducts(products.concat([VariantObject]))
  }

  const handleKeySelect = (rowIndex, field, value) => {
    const nextProducts = [...products]
    setPrimaryKey(value)
    nextProducts = nextProducts.map((item) => ({ ...item, [field]: value }))
    handleChangeProducts(nextProducts)
  }

  const getKeyOptions = (index) => {
    let options = variable.find((item) => item.label === products[index].k) || []
    return options?.value?.map((item) => ({ label: item, value: item }))
  }

  const handleValueSelect = (rowIndex, field, value) => {
    const nextProducts = [...products]
    nextProducts[rowIndex] = { ...nextProducts[rowIndex], [field]: value }
    handleChangeProducts(nextProducts)
  }

  const handleSubOptionschange = (value, label, index) => {
    const nextProducts = [...products]
    nextProducts[index][label] = value

    var result = _.chain(nextProducts)
      .groupBy('v')
      .map((value, key) => {
        return {
          k: primaryKey,
          v: key,
          items: value,
        }
      })
      .value()

    handleChangeProducts(nextProducts)
  }
  const handleChangePrice = ({ target }, index) => {
    const nextProducts = [...products]
    nextProducts[index].price = target.value
    handleChangeProducts(nextProducts)
  }

  return (
    <>
      <FlexboxGrid style={{ gap: 4 }} justify="space-between">
        {products?.map((rowValue, index) => (
          <FlexboxGrid.Item style={{ width: 'calc(100% )' }}>
            <FlexboxGrid style={{ gap: 4 }}>
              <FlexboxGrid.Item style={{ width: 'calc(100% - 4px)' }}>
                {index == 0 && ( //only primary Key
                  <SelectPicker
                    data={data}
                    onChange={(value) => handleKeySelect(index, 'k', value)}
                    value={rowValue[index]?.k}
                    style={{ width: '100%' }}
                  />
                )}
              </FlexboxGrid.Item>

              <FlexboxGrid.Item style={{ width: 'calc(25% - 4px)' }}>
                <SelectPicker
                  data={getKeyOptions(index)}
                  onChange={(value) => handleValueSelect(index, 'v', value)}
                  value={rowValue[index]?.k}
                  style={{ width: '100%' }}
                  placeholder={primaryKey}
                />
              </FlexboxGrid.Item>

              {variable
                .filter((item) => item.label !== primaryKey)
                ?.map((varItem, i) => {
                  return (
                    <>
                      <FlexboxGrid.Item style={{ width: 'calc(25% - 4px)' }}>
                        <SelectPicker
                          data={varItem.value.map((opt) => ({ label: opt, value: opt }))}
                          style={{ width: '100%' }}
                          placeholder={varItem.label}
                          onChange={(value) => handleSubOptionschange(value, varItem.label, index)}
                        />
                      </FlexboxGrid.Item>
                    </>
                  )
                })}
              <FlexboxGrid.Item style={{ width: 'calc(25% - 4px)' }}>
                <CustomInput value={rowValue['price']} onChange={(e) => handleChangePrice(e, index)} />
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </FlexboxGrid.Item>
        ))}

        <div style={{ width: '100%' }}>
          <ButtonGroup size="xs">
            <IconButton onClick={handleAdd} icon={<PlusIcon />} />
            <IconButton onClick={handleMinus} icon={<MinusIcon />} />
          </ButtonGroup>
        </div>
      </FlexboxGrid>
    </>
  )
}

const ProductCreateModal = (props) => {
  const changeTitle = useCommonStore((state) => state.changeTitle)
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const [variable, setVariable] = useState([])

  const [form, setForm] = useState({

    title: 'IPhone 17 Promax',
    description: '17 promax',
    content: '',
    img: [],
    variant: [
      {
        k: 'Dung lượng',
        v: '256Gb',
        items: [
          {
            'Màu sắc': 'Xanh',
            'Phiên bản': 'CN',
            price: 38000000,
          },
          {
            'Màu sắc': 'Đỏ',
            version: 'CN',
            price: 37500000,
          },
          {
            'Màu sắc': 'Tím',
            version: 'VN',
            price: 38500000,
          },
        ],
      },
      {
        k: 'Dung lượng',
        v: '512Gb',
        items: [
          {
            'Màu sắc': 'Xanh',
            'Phiên bản': 'CN',
            price: 49500000,
          },
          {
            'Màu sắc': 'Đỏ',
            'Phiên bản': 'CN',
            price: 41000000,
          },
        ],
      },
    ],
    keyVariant: ['Dung lượng', 'Màu sắc', 'Phiên bản'],
  })

  const [data, setData] = useState()

  const toaster = useToaster()

  useEffect(() => {
    changeTitle('Create Post')
    getCateData()
    getVariables()
    if (props.data) {
      const newData = { ...props.data }
      setForm(newData)
    }

    let abc = [
      {
        k: 'Dung lượng',
        v: '256Gb',
        items: [
          {
            'Màu sắc': 'Xanh',
            'Phiên bản': 'CN',
            price: 38000000,
          },
          {
            'Màu sắc': 'Đỏ',
            version: 'CN',
            price: 37500000,
          },
          {
            'Màu sắc': 'Tím',
            version: 'VN',
            price: 38500000,
          },
        ],
      },
      {
        k: 'Dung lượng',
        v: '512Gb',
        items: [
          {
            'Màu sắc': 'Xanh',
            'Phiên bản': 'CN',
            price: 49500000,
          },
          {
            'Màu sắc': 'Đỏ',
            'Phiên bản': 'CN',
            price: 41000000,
          },
        ],
      },
    ]

    let result = []
    for (let item of abc) {
      if (item.items?.length > 0) {
        for (let vars of item.items) {
          let obj = {
            k: item.k,
            v: item.v,
          }
          for (let key in vars) {
            obj[key] = vars[key]
          }
          result.push(obj)
        }
      }
    }
  }, [])

  const getCateData = async () => {
    try {
      setLoading(true)
      const res = await CategoryService.getCate({ type: 'post' })
      let { data } = res.data
      setData(data)
    } catch (error) {
      console.log('error', error, error?.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  const getVariables = async () => {
    try {
      setLoading(true)
      let _variables = await ProductService.getVariables()

      let _var = Object.keys(_variables.data.data).map((key) => ({
        label: key,
        value: _variables.data.data[key],
      }))

      setVariable(_var)

      toaster.push(<Message>{_variables.data.message}</Message>)
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
              <Form.Group controlId="title">
                <Form.ControlLabel>Tên sản phẩm</Form.ControlLabel>
                <Form.Control name="title" />
              </Form.Group>

              <Form.Group controlId="slug">
                <Form.ControlLabel>Đường dẫn</Form.ControlLabel>
                <Form.Control name="slug" />
              </Form.Group>

              <Form.Group controlId="content">
                <Form.ControlLabel>Nội dung</Form.ControlLabel>
                <Form.Control name="content" accepter={Textarea} />
              </Form.Group>

              <Form.Group controlId="description">
                <Form.ControlLabel>Mô tả</Form.ControlLabel>
                <Form.Control name="description" accepter={Textarea} />
              </Form.Group>
            </CardBlock>

            <CardBlock>
              <Form.Group controlId="">
                <Form.ControlLabel>Biến thể</Form.ControlLabel>
                <Form.Control
                  name="variant"
                  accepter={VariantInput}
                  data={variable.map((item) => ({ label: item.label, value: item.label }))}
                  variable={variable}
                />
              </Form.Group>
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
