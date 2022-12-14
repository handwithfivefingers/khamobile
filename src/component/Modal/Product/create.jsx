import { memo, useEffect, useRef, useState } from 'react'

import CardBlock from 'component/UI/Content/CardBlock'
import { KMEditor, KMInput, KMPrice } from 'component/UI/Content/KMInput'
import Select from 'component/UI/Content/MutiSelect'
import CustomUpload from 'component/UI/Upload/CustomUpload'
import { Button, ButtonToolbar, Content, FlexboxGrid, Form, SelectPicker } from 'rsuite'
import CategoryService from 'service/admin/Category.service'
import ProductService from 'service/admin/Product.service'
import { useCommonStore } from 'src/store/commonStore'
import { useDevStore } from 'src/store/devStore'
import GroupVariant from './GroupVariant'
import slugify from 'slugify'
const ProductCreateModal = (props) => {
  const changeTitle = useCommonStore((state) => state.changeTitle)
  const changeData = useDevStore((state) => state.changeData)
  const [loading, setLoading] = useState(false)
  const [variable, setVariable] = useState([])

  const [_render, setRender] = useState(false)

  const formDataRef = useRef({
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
        props.onSubmit(formDataRef.current)
      }
    } catch (error) {
      console.log('error', error, error?.response?.data?.message)
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setLoading(false)
    }
  }

  const handleAttributes = (val) => {
    formDataRef.current = {
      ...formDataRef.current,
      attributes: val,
    }
    setRender(!_render)
  }

  const handleVariations = (val) => {
    formDataRef.current = {
      ...formDataRef.current,
      variations: val,
    }
    setRender(!_render)
  }

  return (
    <>
      <Content className={'p-4'}>
        <Form formValue={formDataRef?.current} className={'row gx-2 '} fluid>
          <div className="col-10 bg-w rounded " style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <CardBlock>
              <KMInput
                name="title"
                label="T??n s???n ph???m"
                onChange={(v) => {
                  formDataRef.current.title = v
                  formDataRef.current.slug = slugify(v, { lower: true })
                }}
              />
              <KMInput name="slug" label="???????ng d???n" onChange={(v) => (formDataRef.current.slug = v)} />
              <KMEditor name="content" label="N???i dung" onChange={(v) => (formDataRef.current.content = v)} />
              <KMEditor name="description" label="M?? t???" onChange={(v) => (formDataRef.current.description = v)} />
            </CardBlock>

            <CardBlock>
              <FlexboxGrid>
                <FlexboxGrid.Item>
                  <Form.Group controlId="type" className="p-1">
                    <Form.ControlLabel>Lo???i bi???n th???</Form.ControlLabel>
                    <SelectPicker
                      name="type"
                      value={formDataRef.current?.type}
                      onChange={(value) => {
                        formDataRef.current.type = value
                        setRender(!_render)
                      }}
                      data={[
                        { label: '????n gi???n', value: 'simple' },
                        { label: 'Nhi???u bi???n th???', value: 'variable' },
                      ]}
                    />
                  </Form.Group>
                </FlexboxGrid.Item>

                {formDataRef.current?.type === 'simple' && (
                  <div className="p-1">
                    <KMPrice
                      name="price"
                      label="Gi?? ti???n"
                      onChange={(v) => {
                        console.log('price changed', v)
                        formDataRef.current.price = v
                      }}
                    />
                  </div>
                )}

                {formDataRef.current?.type === 'variable' && (
                  <FlexboxGrid.Item style={{ width: '100%' }}>
                    <GroupVariant
                      variableData={variable}
                      attribute={{
                        attributes: formDataRef.current?.attributes || [],
                        setAttributes: (value) => handleAttributes(value),
                      }}
                      variation={{
                        variations: formDataRef.current?.variations || [],
                        setVariations: (value) => handleVariations(value),
                      }}
                    />
                  </FlexboxGrid.Item>
                )}
              </FlexboxGrid>
            </CardBlock>
          </div>
          <div
            className="col-2 position-sticky "
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              top: 0,
            }}
          >
            <CardBlock>
              <Form.Group controlId="img">
                <Form.ControlLabel>???nh b??i post</Form.ControlLabel>

                <Form.Control
                  rows={5}
                  name="upload"
                  accepter={CustomUpload}
                  group
                  action={process.env.API + '/api/upload'}
                  withCredentials={true}
                  onSuccess={(resp, file) => {
                    setRender(!_render)
                    formDataRef.current = {
                      ...formDataRef.current,
                      image: formDataRef.current.image
                        ? [...formDataRef.current.image, { src: resp.url, name: file.name }]
                        : [{ src: resp.url, name: file.name }],
                    }
                  }}
                  value={formDataRef.current?.image}
                />
              </Form.Group>
            </CardBlock>

            <CardBlock>
              <Form.Group controlId="category">
                <Form.ControlLabel>Danh m???c cha</Form.ControlLabel>
                <Form.Control
                  name="category"
                  data={cate || []}
                  labelKey={'name'}
                  accepter={Select}
                  valueKey={'_id'}
                  preventOverflow
                  cascade
                  onChange={(v) => (formDataRef.current.category = v)}
                />
              </Form.Group>
            </CardBlock>

            <Form.Group>
              <Button appearance="primary" onClick={onSubmit}>
                T???o
              </Button>
            </Form.Group>
          </div>
        </Form>
      </Content>
    </>
  )
}

export default memo(ProductCreateModal)
