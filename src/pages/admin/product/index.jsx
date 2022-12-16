import AdminLayout from 'component/UI/AdminLayout'
import { forwardRef, useEffect, useState } from 'react'
import {
  Button,
  Content,
  Modal,
  Table,
  useToaster,
  Message,
  IconButton,
  Whisper,
  ButtonGroup,
  Popover,
  Pagination,
} from 'rsuite'
import ProductService from 'service/admin/Product.service'
import { useCommonStore } from 'src/store/commonStore'
import dynamic from 'next/dynamic'
import PlusIcon from '@rsuite/icons/Plus'
import TrashIcon from '@rsuite/icons/Trash'
import CheckIcon from '@rsuite/icons/Check'
import CloseIcon from '@rsuite/icons/Close'
const ProductCreateModal = dynamic(() => import('component/Modal/Product/create'))

const { Column, HeaderCell, Cell } = Table

const renderAlert = ({ onClose, onProgress, right, top, className }, ref) => {
  return (
    <Popover ref={ref} className={className} full>
      <Message showIcon type="warning" header="Bạn có muốn xóa?">
        <ButtonGroup>
          <IconButton
            icon={<CloseIcon />}
            size="sm"
            appearance="default"
            color="blue"
            onClick={(event) => {
              onClose()
              event.stopPropagation()
            }}
          />
          <IconButton icon={<CheckIcon />} size="sm" appearance="primary" color="blue" onClick={onProgress} />
        </ButtonGroup>
      </Message>
    </Popover>
  )
}

const ActionCell = ({ rowData, dataKey, ...props }) => {
  const onProgress = (event) => {
    props?.onDelete(rowData, event)
  }
  return (
    <Cell {...props} className="link-group">
      <Whisper placement="leftStart" trigger="click" speaker={renderAlert} onProgress={onProgress}>
        <IconButton size="xs" appearance="subtle" icon={<TrashIcon />} />
      </Whisper>
    </Cell>
  )
}

const Products = () => {
  const changeTitle = useCommonStore((state) => state.changeTitle)

  const [product, setProduct] = useState([])
  const [loading, setLoading] = useState(false)

  const [modal, setModal] = useState({
    open: false,
    component: null,
  })

  const toaster = useToaster()

  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)

  const handleChangeLimit = (dataKey) => {
    setPage(1)
    setLimit(dataKey)
  }

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

      // return
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

  const handleDelete = (rowData, event) => {
    console.log(rowData)
    event.stopPropagation()
  }

  const data = product.filter((v, i) => {
    const start = limit * (page - 1)
    const end = start + limit
    return i >= start && i < end
  })

  return (
    <>
      <Content className={'bg-w h-100'}>
        <Table
          // fillHeight={!loading}
          height={40 * (limit + 1)}
          rowHeight={40}
          data={() =>
            product.filter((v, i) => {
              const start = limit * (page - 1)
              const end = start + limit
              return i >= start && i < end
            })
          }
          onRowClick={handleOpenProduct}
          loading={loading}
        >
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

          <Column width={100} align="center">
            <HeaderCell>
              <IconButton
                icon={<PlusIcon />}
                size="xs"
                color="blue"
                appearance="primary"
                onClick={() =>
                  setModal({
                    open: true,
                    component: <ProductCreateModal onSubmit={onCreate} />,
                  })
                }
              />
            </HeaderCell>

            <ActionCell onDelete={handleDelete} right={0} />
          </Column>
        </Table>
        <div style={{ padding: 20 }}>
          <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            maxButtons={5}
            size="xs"
            layout={['total', '-', 'limit', '|', 'pager', 'skip']}
            total={product.length}
            limitOptions={[10, 30, 50]}
            limit={limit}
            activePage={page}
            onChangePage={setPage}
            onChangeLimit={handleChangeLimit}
          />
        </div>
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
