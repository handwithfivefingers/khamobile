import EditIcon from '@rsuite/icons/Edit'
import PlusIcon from '@rsuite/icons/Plus'
import TrashIcon from '@rsuite/icons/Trash'
import AdminLayout from 'component/UI/AdminLayout'
import moment from 'moment'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { FaClone } from 'react-icons/fa'
import {
  Button,
  Checkbox,
  Content,
  IconButton,
  Input,
  Modal,
  Pagination,
  Popover,
  SelectPicker,
  Stack,
  Table,
  useToaster,
  Whisper,
} from 'rsuite'
import CategoryService from 'service/admin/Category.service'
import ProductService from 'service/admin/Product.service'
import { formatCurrency, message } from 'src/helper'
import { useCommonStore } from 'src/store'

const ProductCreateModal = dynamic(() => import('component/Modal/Product/create'))

const { Column, HeaderCell, Cell } = Table

const ActionCell = ({ rowData, dataKey, onEdit, onDuplicate, ...props }) => {
  const whisperRef = useRef()
  const onProgress = (event) => {
    props?.onDelete(rowData, event)
  }
  return (
    <Cell {...props} className="link-group">
      <Stack spacing={8}>
        <IconButton
          onClick={() => onDuplicate(rowData)}
          size="sm"
          appearance="primary"
          icon={<FaClone />}
          color="blue"
        />
        <IconButton onClick={() => onEdit(rowData)} size="sm" appearance="primary" icon={<EditIcon />} color="blue" />

        <Whisper
          placement="leftStart"
          trigger="click"
          speaker={
            <Popover arrow={false} className="d-flex" style={{ width: '200px' }} onClick={(e) => e.stopPropagation()}>
              <span className="m-2" style={{ fontSize: 16, fontWeight: 500 }}>
                Bạn có muốn xóa ?
              </span>

              <Button
                className="m-2"
                size="sm"
                appearance="primary"
                color="red"
                onClick={(e) => {
                  onProgress(rowData)
                  whisperRef.current.close()
                }}
                style={{ background: 'var(--rs-red-800)' }}
              >
                Xác nhận
              </Button>
            </Popover>
          }
          ref={whisperRef}
        >
          <IconButton
            icon={<TrashIcon />}
            size="sm"
            color="red"
            appearance="primary"
            onClick={(e) => e.stopPropagation()}
          />
        </Whisper>
      </Stack>
    </Cell>
  )
}

const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
  <Cell {...props} style={{ padding: 0 }}>
    <div style={{ lineHeight: '46px' }}>
      <Checkbox
        value={rowData[dataKey]}
        inline
        onChange={onChange}
        checked={checkedKeys?.some((item) => item === rowData[dataKey])}
      />
    </div>
  </Cell>
)

const Products = (props) => {
  const { select, noEdit, propsChecked } = props

  const { product: productStore, changeProduct, changeTitle } = useCommonStore((state) => state)

  const [sortColumn, setSortColumn] = useState()

  const [sortType, setSortType] = useState()

  const [product, setProduct] = useState([])

  const [loading, setLoading] = useState(false)

  const toaster = useToaster()

  const [limit, setLimit] = useState(10)

  const [page, setPage] = useState(1)

  const [filterData, setFilterData] = useState([])

  const [filter, setFilter] = useState({})

  const [categorySelector, setCategorySelector] = useState([])

  const [modal, setModal] = useState({
    open: false,
    component: null,
  })

  useEffect(() => {
    if (!props) {
      changeTitle('Page Products')
      getProducts()
    } else {
      getProducts()
    }
    getCategory()
  }, [])

  useEffect(() => {
    if (Object.keys(filter)) {
      const data = [...product]
      if (filter.category) data = data.filter((item) => item.category.some((_cate) => _cate.name === filter?.category))
      if (filter.title) data = data.filter((item) => item.title?.toLowerCase().includes(filter?.title?.toLowerCase()))
      setFilterData(data)
    } else {
      setFilterData(product)
    }
  }, [filter])

  const getCategory = async () => {
    const resp = await CategoryService.getProdCate()
    setCategorySelector(resp.data.data.map((item) => ({ label: item.name, value: item.name })))
  }

  const getProducts = async () => {
    try {
      setLoading(true)
      const resp = await ProductService.getProduct()
      // changeProduct(resp.data.data)
      setProduct(resp.data.data)
      setFilterData(resp.data.data)
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
      getProducts()
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

  const handleDelete = async (rowData, event) => {
    try {
      let resp = await ProductService.deleteProduct({ _id: rowData._id, type: rowData.type })
      if (resp.status === 200) {
        toaster.push(message('success', resp.data.message), { placement: 'topEnd' })
      }
    } catch (error) {
      console.log('deleteProduct', error, error?.response?.data)
      toaster.push(message('error', error.message || 'Đã có lỗi xảy ra, vui lòng liên hệ quản trị viên'), {
        placement: 'topEnd',
      })
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
      if (select && propsChecked.checkedKeys) {
        return filterData.sort((a, b) => {
          // b._id
          if (propsChecked.checkedKeys.includes(b._id) && propsChecked.checkedKeys.includes(a._id)) {
            return -1
          }
          if (propsChecked.checkedKeys.includes(b._id)) {
            return 1
          }
          if (propsChecked.checkedKeys.includes(a._id)) {
            return -1
          }
          return 0
        })
      } else {
        return filterData.filter((v, i) => {
          const start = limit * (page - 1)
          const end = start + limit
          return i >= start && i < end
        })
      }
    }

    return filterData.filter((v, i) => {
      const start = limit * (page - 1)
      const end = start + limit
      return i >= start && i < end
    })
  }

  const handleDuplicate = async ({ _id }) => {
    try {
      const resp = await ProductService.duplicateProduct({ _id })
      toaster.push(message('success', resp.data.message), { placement: 'topEnd' })
    } catch (error) {
      toaster.push(message('error', error.message || 'Đã có lỗi xảy ra, vui lòng liên hệ quản trị viên'), {
        placement: 'topEnd',
      })
      console.log(error)
    } finally {
      getProducts()
    }
  }

  const handleClose = () => {
    setModal({ open: false, component: null })
  }

  const handleChangeLimit = (dataKey) => {
    setPage(1)
    setLimit(dataKey)
  }

  const handleCheck = (value, checked) => {
    const { checkedKeys, setCheckedKeys } = propsChecked
    const keys = checked ? [...checkedKeys, value] : checkedKeys.filter((item) => item !== value)
    setCheckedKeys(keys)
  }
  // debugger
  return (
    <>
      <Stack spacing={10} className="py-2">
        <span>Tìm kiếm: </span>
        <Input placeholder="Tên sản phẩm" onChange={(v) => setFilter((state) => ({ ...state, title: v }))} />
        <SelectPicker
          placeholder="Danh mục"
          data={categorySelector || []}
          onChange={(v) => setFilter((state) => ({ ...state, category: v }))}
        />
      </Stack>
      <Content className={'bg-w'}>
        <Table
          height={60 * (limit + 1)}
          rowHeight={60}
          data={getData()}
          loading={loading}
          sortColumn={sortColumn}
          sortType={sortType}
          onSortColumn={handleSortColumn}
        >
          {select && (
            <Column width={50} align="center" sortable>
              <HeaderCell style={{ padding: 0 }}></HeaderCell>
              <CheckCell dataKey="_id" checkedKeys={propsChecked.checkedKeys} onChange={handleCheck} />
            </Column>
          )}

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
          {!noEdit && (
            <Column width={120} align="center">
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

              <ActionCell onDelete={handleDelete} onEdit={handleOpenProduct} onDuplicate={handleDuplicate} right={0} />
            </Column>
          )}
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
            total={filterData.length}
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
