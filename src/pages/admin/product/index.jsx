import CheckIcon from '@rsuite/icons/Check'
import CloseIcon from '@rsuite/icons/Close'
import EditIcon from '@rsuite/icons/Edit'
import PlusIcon from '@rsuite/icons/Plus'
import TrashIcon from '@rsuite/icons/Trash'
import AdminLayout from 'component/UI/AdminLayout'
import moment from 'moment'
import dynamic from 'next/dynamic'
import { forwardRef, useEffect, useRef, useState } from 'react'
import {
  ButtonGroup,
  Content,
  IconButton,
  Message,
  Modal,
  Pagination,
  Popover,
  Stack,
  Table,
  useToaster,
  Whisper,
} from 'rsuite'
import ProductService from 'service/admin/Product.service'
import { formatCurrency } from 'src/helper'
import { useCommonStore } from 'src/store/commonStore'

const ProductCreateModal = dynamic(() => import('component/Modal/Product/create'))

const { Column, HeaderCell, Cell } = Table

const RenderAlert = forwardRef(({ right, top, className, ...props }, ref) => {
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
              props?.closeRef.current.close()
            }}
          />
          <IconButton
            icon={<CheckIcon />}
            size="sm"
            appearance="primary"
            color="blue"
            onClick={() => props.onClick()}
          />
        </ButtonGroup>
      </Message>
    </Popover>
  )
})

const ActionCell = ({ rowData, dataKey, onEdit, ...props }) => {
  const whisperRef = useRef()
  const onProgress = (event) => {
    props?.onDelete(rowData, event)
  }
  return (
    <Cell {...props} className="link-group">
      <Stack spacing={8}>
        <IconButton onClick={() => onEdit(rowData)} size="sm" appearance="primary" icon={<EditIcon />} color="blue" />
        <Whisper
          placement="leftStart"
          trigger="click"
          speaker={<RenderAlert {...props} onClick={onProgress} closeRef={whisperRef} />}
          ref={whisperRef}
        >
          <IconButton size="sm" appearance="primary" icon={<TrashIcon />} color="red" />
        </Whisper>
      </Stack>
    </Cell>
  )
}

const Products = () => {
  const changeTitle = useCommonStore((state) => state.changeTitle)
  const [sortColumn, setSortColumn] = useState()
  const [sortType, setSortType] = useState()
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
      getProducts()
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
    try {
      setLoading(true)
      let data = await getProductById({ _id, type })
      setModal({
        open: true,
        component: <ProductCreateModal data={data} onSubmit={onUpdate} />,
      })
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const message = (type, header) => <Message showIcon type={type} header={header} closable />

  const handleDelete = async (rowData, event) => {
    try {
      let resp = await ProductService.deleteProduct({ _id: rowData._id, type: rowData.type })
      if (resp.status === 200) {
      }
    } catch (error) {
      console.log('deleteProduct', error, error?.response?.data)
    } finally {
      getProducts()
    }
  }

  const handleSortColumn = (sortColumn, sortType) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSortColumn(sortColumn)
      setSortType(sortType)
    }, 500)
  }

  const getData = () => {
    if (sortColumn && sortType) {
      const prod = product.sort((a, b) => {
        let x = moment(a[sortColumn]).valueOf()
        let y = moment(b[sortColumn]).valueOf()
        // if (typeof x === 'string') {
        //   x = x.charCodeAt()
        // }
        // if (typeof y === 'string') {
        //   y = y.charCodeAt()
        // }

        if (sortType === 'asc') {
          return x - y
        } else {
          return y - x
        }
      })

      console.log('coming xxx', sortColumn, sortType, prod)

      return prod.filter((v, i) => {
        const start = limit * (page - 1)
        const end = start + limit
        return i >= start && i < end
      })
    }

    return product.filter((v, i) => {
      const start = limit * (page - 1)
      const end = start + limit
      return i >= start && i < end
    })
  }

  return (
    <>
      <Content className={'bg-w'}>
        <Table
          // fillHeight={!loading}
          height={60 * (limit + 1)}
          rowHeight={60}
          data={getData()}
          loading={loading}
          sortColumn={sortColumn}
          sortType={sortType}
          onSortColumn={handleSortColumn}
        >
          <Column width={60} align="center" fixed fullText>
            <HeaderCell>Id</HeaderCell>
            <Cell dataKey="_id">{(rowData) => <span onClick={(e) => e.preventDefault()}>{rowData['_id']}</span>}</Cell>
          </Column>

          <Column width={150} flexGrow={1}>
            <HeaderCell>Title</HeaderCell>
            <Cell dataKey="title" />
          </Column>

          <Column width={120} sortable>
            <HeaderCell>Ngày cập nhật</HeaderCell>
            <Cell dataKey="updatedAt">
              {(rowData) => <span>{moment(rowData.updatedAt).format('DD/MM/YYYY')}</span>}
            </Cell>
          </Column>

          <Column width={120} sortable>
            <HeaderCell>Ngày tạo</HeaderCell>
            <Cell dataKey="createdAt">
              {(rowData) => <span>{moment(rowData.createdAt).format('DD/MM/YYYY')}</span>}
            </Cell>
          </Column>

          <Column width={120} fullText>
            <HeaderCell>Price</HeaderCell>
            <Cell dataKey="price">{(rowData) => <span>{formatCurrency(rowData.price, { symbol: ' đ' })}</span>}</Cell>
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

            <ActionCell onDelete={handleDelete} onEdit={handleOpenProduct} right={0} />
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
