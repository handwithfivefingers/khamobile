import AdminLayout from 'component/UI/AdminLayout'
import { useEffect, useState } from 'react'
import { Button, Content, Modal, Table, useToaster, Message } from 'rsuite'
import ProductService from 'service/admin/Product.service'
import { useCommonStore } from 'src/store/commonStore'
import dynamic from 'next/dynamic'

const ProductCreateModal = dynamic(() => import('component/Modal/Product/create'))

const { Column, HeaderCell, Cell } = Table

const Products = () => {
  const changeTitle = useCommonStore((state) => state.changeTitle)

  const [product, setProduct] = useState([])
  const [loading, setLoading] = useState(false)

  const [modal, setModal] = useState({
    open: false,
    component: null,
  })

  const toaster = useToaster()

  useEffect(() => {
    changeTitle('Page Products')
    getProducts()
  }, [])

  const handleClose = () => setModal({ open: false, component: null })

  const getProducts = async () => {
    try {
      setLoading(true)
      const resp = await ProductService.getProduct()
      setProduct(resp.data.data)
    } catch (error) {
      console.log('getProducts error: ' + error)
    } finally {
      setLoading(false)
    }
  }

  const onUpdate = async (formValue) => {
    try {
      setLoading(true)
      const resp = await ProductService.updateProduct(formValue)
      if (resp.status === 200) {
        toaster.push(message('success', resp.data.message), { placement: 'topEnd' })
        handleClose()
      }
    } catch (error) {
      console.log('onUpdate error', error)
      toaster.push(
        message(
          'error',
          error.response?.data?.message || error.message || 'Đã có lỗi xảy ra, vui lòng liên hệ quản trị viên',
        ),
        { placement: 'topEnd' },
      )
      handleClose()
    } finally {
      setLoading(false)
    }
  }

  const onCreate = async (formValue) => {
    try {
      setLoading(true)
      const resp = await ProductService.createProduct(formValue)
      if (resp.status === 200) {
        toaster.push(message('success', resp.data.message), { placement: 'topEnd' })
        handleClose()
      }
    } catch (error) {
      console.log('onCreate error', error)
      toaster.push(
        message(
          'error',
          error.response?.data?.message || error.message || 'Đã có lỗi xảy ra, vui lòng liên hệ quản trị viên',
        ),
        { placement: 'topEnd' },
      )
      handleClose()
    } finally {
      setLoading(false)
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

  const message = (type, header) => <Message showIcon type={type} header={header} closable />

  return (
    <>
      <Content className={'bg-w h-100'}>
        <Table fillHeight data={product} onRowClick={handleOpenProduct} loading={loading}>
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
