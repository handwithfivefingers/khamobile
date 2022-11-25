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
import { Button, ButtonGroup, ButtonToolbar, Content, FlexboxGrid, Form, IconButton, SelectPicker } from 'rsuite'
import CategoryService from 'service/admin/Category.service'
import ProductService from 'service/admin/Product.service'
import { useCommonStore } from 'src/store/commonStore'
import { KMEditor, KMInput, KMSelect } from 'component/UI/Content/KMInput'

const CustomInput = (props) => {
  return <input name="title" class="rs-input" type="text" {...props} />
}

const VariantInput = ({ value, onChange, data, variable, keyAttribute, ...rest }) => {
  const [products, setProducts] = React.useState(value)

  const [primaryKey, setPrimaryKey] = useState(keyAttribute)

  const handleChangeProducts = (nextProducts) => {
    setProducts(nextProducts)
    onChange(nextProducts)
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
                  value={primaryKey}
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

  const [variable, setVariable] = useState(new Map())

  const [form, setForm] = useState(
    props?.data,
    //   {
    //   title: 'IPhone 17 Promax',
    //   description: '17 promax',
    //   content: '',
    //   img: [],
    //   variant: [
    //     {
    //       _id: '637e2ed026ba8d9aca5b56f4',
    //       k: 'Dung lượng',
    //       v: '256Gb',
    //       price: 38000000,
    //       slug: 'iphone-17-promax-256Gb-FJQVe45N1',
    //     },
    //     {
    //       _id: '637e2ed026ba8d9aca5b56f6',
    //       k: 'Dung lượng',
    //       v: '256Gb',
    //       price: 37500000,
    //       slug: 'iphone-17-promax-256Gb-H1llaZ5eq',
    //     },
    //     // {
    //     //   k: 'Dung lượng',
    //     //   v: '256Gb',
    //     //   items: [
    //     //     {
    //     //       'Màu sắc': 'Xanh',
    //     //       'Phiên bản': 'CN',
    //     //       price: 38000000,
    //     //     },
    //     //     {
    //     //       'Màu sắc': 'Đỏ',
    //     //       version: 'CN',
    //     //       price: 37500000,
    //     //     },
    //     //     {
    //     //       'Màu sắc': 'Tím',
    //     //       version: 'VN',
    //     //       price: 38500000,
    //     //     },
    //     //   ],
    //     // },
    //     // {
    //     //   k: 'Dung lượng',
    //     //   v: '512Gb',
    //     //   items: [
    //     //     {
    //     //       'Màu sắc': 'Xanh',
    //     //       'Phiên bản': 'CN',
    //     //       price: 49500000,
    //     //     },
    //     //     {
    //     //       'Màu sắc': 'Đỏ',
    //     //       'Phiên bản': 'CN',
    //     //       price: 41000000,
    //     //     },
    //     //   ],
    //     // },
    //   ],
    //   keyVariant: ['Dung lượng', 'Màu sắc', 'Phiên bản'],
    // }
  )

  const [data, setData] = useState()

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

      // let _var = Object.keys(_variables.data.data).map((key) => ({
      //   label: key,
      //   value: _variables.data.data[key],
      // }))

      let result = new Map()

      // .map((key) => ({
      //   label: key,
      //   value: _variables.data.data[key],
      // }))

      for (let key in _variables.data.data) {
        result.set(key, _variables.data.data[key])
      }

      setVariable(result)
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

  console.log(variable)
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
              {form?.variant?.map((item) => {
                return (
                  <FlexboxGrid style={{ gap: '4px' }}>
                    {Object.keys(item).map((key) => {
                      if (key === '_id' || key === 'slug') return ''
                      else if (key === 'price')
                        return (
                          <FlexboxGrid.Item style={{ width: 'calc(25% - 4px)' }}>
                            <KMInput name={key} label={key} value={item[key]} />
                          </FlexboxGrid.Item>
                        )
                      else {
                        let listSelect = variable.get(key)?.map((item) => ({ label: item, value: item }))
                        return (
                          <FlexboxGrid.Item style={{ width: 'calc(25% - 4px)' }}>
                            <KMSelect
                              name={key}
                              label={key}
                              data={listSelect}
                              value={item[key]}
                              style={{ width: '100%' }}
                            />
                          </FlexboxGrid.Item>
                        )
                      }
                    })}
                  </FlexboxGrid>
                )
              })}
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
