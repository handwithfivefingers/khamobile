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
  useEffect(() => {
    changeTitle('Page Products')
    getProducts()
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
     
      await ProductService.updateProduct(formValue)

    } catch (error) {
      console.log('onUpdate error', error)
    }
  }

  const onCreate = async (formValue) => {
    try {
      const form = new FormData()

      if (formValue.type === 'simple') {
        form.append('_id', formValue._id)
        form.append('title', formValue.title)
        form.append('slug', formValue.slug)
        form.append('description', formValue.description)
        form.append('content', formValue.content)
        form.append('price', formValue.price)
        form.append('category', JSON.stringify(formValue.category))
        form.append('type', formValue.type)
        if (formValue.img?.length) {
          for (let image of formValue.img) {
            if (image?.blobFile && image?.blobFile instanceof Blob) {
              form.append('img', image?.blobFile)
            } else {
              form.append('img', image)
            }
          }
        }
      } else if (formValue.type === 'variable') {
        form.append('_id', formValue._id)
        form.append('title', formValue.title)
        form.append('slug', formValue.slug)
        form.append('description', formValue.description)
        form.append('content', formValue.content)
        form.append('price', formValue.price)
        form.append('category', JSON.stringify(formValue.category))
        form.append('type', formValue.type)
        form.append('primary', formValue.primary)

        if (formValue.img?.length) {
          for (let image of formValue.img) {
            if (image?.blobFile && image?.blobFile instanceof Blob) {
              form.append('img', image.blobFile)
            } else {
              form.append('img', image)
            }
          }
        }
        if (formValue.variations?.length) {
          form.append('variations', JSON.stringify(formValue.variations))
        }
      }

      await ProductService.createProduct(form)
    } catch (error) {
      console.log('onCreate error', error)
    }
  }

  const getProductById = async ({ _id, type }) => {
    try {
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
      <Content className={'bg-w h-100'}>
        <Table fillHeight data={product} onRowClick={handleOpenProduct}>
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
