import ProductCreateModal from 'component/Modal/Product/create'
import AdminLayout from 'component/UI/AdminLayout'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { Content, Table, Button, Modal, DOMHelper } from 'rsuite'
import ProductService from 'service/admin/Product.service'
import { useCommonStore } from 'src/store/commonStore'

const { Column, HeaderCell, Cell } = Table

const Products = () => {
  const changeTitle = useCommonStore((state) => state.changeTitle)

  const [height, setHeight] = useState(false)
  const router = useRouter()
  const [product, setProduct] = useState([])
  const [modal, setModal] = useState({
    open: false,
    component: null,
  })
  const nodeRef = useRef()
  useEffect(() => {
    changeTitle('Page Products')
    getProducts()
    setHeight(DOMHelper.getHeight(nodeRef.current))
  }, [])

  const handleClose = () => setModal({ open: false, component: null })

  const getProducts = async () => {
    try {
      const resp = await ProductService.getProduct()
      setProduct(resp.data.data)
    } catch (error) {
      console.log('getProducts error: ' + error)
    }
  }

  const onUpdate = async (formValue) => {
    try {
      const form = new FormData()
      for (let key in formValue) {
        if (key === 'img') {
          for (let img of formValue[key]) {
            if (img.src && typeof img.src === 'string') {
              form.append(key, img.src)
            } else if (img?.blobFile && img?.blobFile instanceof Blob) {
              form.append(key, img?.blobFile)
            }
          }
        } else if (key === 'variable') {
          form.append(key, JSON.stringify(formValue?.[key]))
        } else form.append(key, formValue?.[key])
      }

      await ProductService.updateProduct(formValue._id, form)
    } catch (error) {
      console.log('onUpdate error', error)
    }
  }

  const onCreate = async (formValue) => {
    try {
      const form = new FormData()
      for (let key in formValue) {
        if (key === 'img') {
          for (let img of formValue[key]) {
            if (img.src && typeof img.src === 'string') {
              form.append(key, img.src)
            } else if (img?.blobFile && img?.blobFile instanceof Blob) {
              form.append(key, img?.blobFile)
            }
          }
        } else if (key === 'variable') {
          form.append(key, JSON.stringify(formValue?.[key]))
        } else form.append(key, formValue?.[key])
      }

      await ProductService.createProduct(form)
    } catch (error) {
      console.log('onCreate error', error)
    }
  }

  const getProductById = async ({ _id, type }) => {
    try {
      console.log(_id, type)
      let resp = await ProductService.getProductById({ _id, type })
      return resp.data.data
    } catch (error) {
      console.log('getProductById', error, error?.response?.data)
    }
  }
  const handleOpenProduct = async ({ _id, type }) => {
    let data = await getProductById({ _id, type })
    setModal({
      open: true,
      component: <ProductCreateModal data={data} onSubmit={onUpdate} />,
    })
  }
  return (
    <>
      <Content className={'bg-w h-100'} ref={nodeRef}>
        <Table height={height} data={product} onRowClick={handleOpenProduct}>
          <Column width={60} align="center" fixed>
            <HeaderCell>Id</HeaderCell>
            <Cell dataKey="_id" />
          </Column>

          <Column width={150} flexGrow={1}>
            <HeaderCell>Title</HeaderCell>
            <Cell dataKey="title" />
          </Column>

          <Column width={150}>
            <HeaderCell>Content</HeaderCell>
            <Cell dataKey="content" />
          </Column>

          <Column width={100}>
            <HeaderCell>Price</HeaderCell>
            <Cell dataKey="price" />
          </Column>
          <Column width={100}>
            <HeaderCell>
              <Button
                color="blue"
                appearance="primary"
                onClick={() =>
                  setModal({
                    open: true,
                    component: <ProductCreateModal onSubmit={onCreate} />,
                  })
                }
              >
                Add
              </Button>
            </HeaderCell>
            <Cell />
          </Column>
        </Table>
      </Content>

      <Modal size={'full'} open={modal.open} onClose={handleClose} keyboard={false} backdrop={'static'}>
        <Modal.Header>
          <Modal.Title>Create</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modal?.component}</Modal.Body>
      </Modal>
    </>
  )
}
Products.Admin = AdminLayout

export default Products
