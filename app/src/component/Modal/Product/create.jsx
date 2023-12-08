import { KMInput } from 'component/UI/Content/KMInput'
import Select from 'component/UI/Content/MutiSelect'
import { TinyMceEditor } from 'component/UI/Editor/TinyMCE'
import KMEditingTable from 'component/UI/KMEditingTable'
import CustomUpload from 'component/UI/Upload/CustomUpload'
import { memo, useEffect, useRef, useState } from 'react'
import { Button, Content, Form, Panel, PanelGroup } from 'rsuite'
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
  const editorRef = useRef(null)
  const descRef = useRef(null)
  const formDataRef = useRef({
    price: 0,
    regular_price: 0,
    purchasable: true,
    stock_status: 'instock',
    parentId: '',
    variations: [],
    category: [],
    delete: [],
    deleteAll: false,
    type: 'simple',
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
      let resp = await ProductService.getAttribute()
      let _variables = resp.data.data
      setVariable(_variables)
    } catch (error) {
      console.log('getVariables error', error)
    }
  }

  const getCategory = async () => {
    try {
      let resp = await CategoryService.getProdCate()
      let category = resp.data.data
      setCate(category)
    } catch (error) {
      console.log('getVariables error', error)
    }
  }

  const onSubmit = async () => {
    try {
      setLoading(true)
      const content = editorRef.current.getContent()
      const description = descRef.current.getContent()
      if (props.onSubmit) {
        props.onSubmit({ ...formDataRef.current, content, description })
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

  const handleDeleteVariation = (_id = null, deleteAll = false) => {
    if (_id) {
      formDataRef.current?.delete.push(_id)
    }

    if (deleteAll) {
      formDataRef.current.deleteAll = deleteAll
    }
  }

  const handleProductType = (value, e) => {
    formDataRef.current.type = value
    setRender(!_render)
  }

  const handleProductInformation = (value, fieldName) => {
    formDataRef.current[fieldName] = value
    setRender(!_render)
  }

  const handleRemoveFile = (file) => {
    const listImage = [...formDataRef.current.image]
    let fileListLength = listImage.length
    let index = -1
    if (fileListLength) {
      index = listImage.findIndex((imageFile) => imageFile._id === file._id)
    }
    if (index !== -1) {
      listImage.splice(index, 1)
    }
    formDataRef.current.image = listImage
    setRender(!_render)
  }

  const handleUploadSuccess = (resp, file) => {
    setRender(!_render)
    formDataRef.current = {
      ...formDataRef.current,
      image: formDataRef.current.image
        ? [...formDataRef.current.image, { src: resp.url, name: file.name }]
        : [{ src: resp.url, name: file.name }],
    }
  }

  return (
    <>
      <Content className={'p-4'}>
        <Form formValue={formDataRef?.current} className={'grid-cols-12 grid gap-x-2 '} fluid>
          <div className="col-span-9 bg-gray-50 rounded " style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
              <Panel header="Nội dung" collapsible>
                <TinyMceEditor name="content" forwardRef={editorRef} data={props?.data?.content} />
              </Panel>
              <Panel header="Mô tả" collapsible>
                <TinyMceEditor name="description" forwardRef={descRef} data={props?.data?.description} />
              </Panel>

              <Panel header="Thông số kỹ thuật" collapsible>
                <KMEditingTable
                  name="information"
                  onChange={(v) => (formDataRef.current.information = v)}
                  data={formDataRef.current?.information}
                />
              </Panel>

              <Panel
                header={
                  <div className="flex justify-start items-center" style={{ gap: 12 }}>
                    Thông tin sản phẩm
                  </div>
                }
                collapsible
                defaultExpanded
              >
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
                  deleteVariation={{
                    delete: formDataRef.current?.delete || [],
                    setDeleteVariation: handleDeleteVariation,
                  }}
                  productType={{
                    type: formDataRef.current?.type,
                    setProductType: handleProductType,
                  }}
                  information={{
                    data: formDataRef.current,
                    setProductInformation: handleProductInformation,
                  }}
                />
              </Panel>
            </PanelGroup>
          </div>
          <div className="col-span-3">
            <PanelGroup className="sticky top-0">
              <Panel header="Ảnh bài post" expanded>
                <Form.Group controlId="img">
                  <Form.Control
                    rows={5}
                    name="upload"
                    accepter={CustomUpload}
                    group
                    action={process.env.API + '/api/upload'}
                    withCredentials={true}
                    onSuccess={handleUploadSuccess}
                    value={formDataRef.current?.image}
                    onRemove={handleRemoveFile}
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
                  {props?.data ? 'Cập nhật' : 'Tạo'}
                </Button>
              </Panel>
            </PanelGroup>
          </div>
        </Form>
      </Content>
    </>
  )
}

export default memo(ProductCreateModal)
