import { memo, useEffect, useRef, useState } from 'react'
import CardBlock from 'component/UI/Content/CardBlock'
import { KMEditor, KMInput, KMPrice } from 'component/UI/Content/KMInput'
import Select from 'component/UI/Content/MutiSelect'
import CustomUpload from 'component/UI/Upload/CustomUpload'
import { Affix, Button, Content, FlexboxGrid, Form, Panel, PanelGroup, SelectPicker } from 'rsuite'
import CategoryService from 'service/admin/Category.service'
import ProductService from 'service/admin/Product.service'
import slugify from 'slugify'
import { useCommonStore } from 'src/store/commonStore'
import GroupVariant from './GroupVariant'
const ProductCreateModal = (props) => {
  const changeTitle = useCommonStore((state) => state.changeTitle)
  const [loading, setLoading] = useState(false)
  const [variable, setVariable] = useState([])

  const [_render, setRender] = useState(false)

  const formDataRef = useRef({
    price: 0,
    regular_price: 0,
    purchasable: true,
    stock_status: 'instock',
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

  const handleStockStatus = (name, value) => {
    formDataRef.current = {
      ...formDataRef.current,
      [name]: value,
    }
    setRender(!_render)
  }

  return (
    <>
      <Content className={'p-4'}>
        <Form formValue={formDataRef?.current} className={'row gx-2 '} fluid>
          <div className="col-9 bg-w rounded " style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <PanelGroup>
              <Panel header="Tên sản phẩm" collapsible defaultExpanded>
                <KMInput
                  name="title"
                  onChange={(v) => {
                    formDataRef.current.title = v
                    formDataRef.current.slug = slugify(v, { lower: true })
                  }}
                />
              </Panel>
              <Panel header="Đường dẫn" collapsible defaultExpanded>
                <KMInput name="slug" onChange={(v) => (formDataRef.current.slug = v)} />
              </Panel>
              <Panel header="Nội dung" collapsible defaultExpanded>
                <KMEditor name="content" onChange={(v) => (formDataRef.current.content = v)} />
              </Panel>
              <Panel header="Mô tả" collapsible defaultExpanded>
                <KMEditor name="description" onChange={(v) => (formDataRef.current.description = v)} />
              </Panel>
              <Panel
                header={
                  <div className="d-flex justify-content-start align-items-center" style={{ gap: 12 }}>
                    Loại biến thể
                    <Form.Group controlId="type" className="p-1">
                      <SelectPicker
                        name="type"
                        value={formDataRef.current?.type}
                        onChange={(value, e) => {
                          formDataRef.current.type = value
                          setRender(!_render)
                        }}
                        onClick={(e) => e.preventDefault()}
                        data={[
                          { label: 'Đơn giản', value: 'simple' },
                          { label: 'Nhiều biến thể', value: 'variable' },
                        ]}
                      />
                    </Form.Group>
                  </div>
                }
                // collapsible
                defaultExpanded
              >
                <FlexboxGrid>
                  <FlexboxGrid.Item></FlexboxGrid.Item>

                  {formDataRef.current?.type === 'simple' && (
                    <div className="p-1">
                      <KMPrice
                        name="price"
                        label="Giá tiền"
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
                        stockData={{
                          stock_status: formDataRef.current?.stock_status,
                          purchasable: formDataRef.current?.purchasable,
                          setStock: handleStockStatus,
                        }}
                        variableData={variable}
                        attribute={{
                          attributes: formDataRef.current?.attributes || [],
                          setAttributes: handleAttributes,
                        }}
                        variation={{
                          variations: formDataRef.current?.variations || [],
                          setVariations: handleVariations,
                        }}
                      />
                    </FlexboxGrid.Item>
                  )}
                </FlexboxGrid>
              </Panel>
            </PanelGroup>
          </div>
          <div className="col-3">
            <Affix top={50}>
              <PanelGroup>
                <Panel header="Ảnh bài post" expanded>
                  <Form.Group controlId="img">
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
                </Panel>
                <Panel header="Danh mục" collapsible>
                  <Form.Group controlId="category">
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
                </Panel>
                <Panel>
                  <Button appearance="primary" onClick={onSubmit}>
                    Tạo
                  </Button>
                </Panel>
              </PanelGroup>
            </Affix>
          </div>
        </Form>
      </Content>
    </>
  )
}

export default memo(ProductCreateModal)
