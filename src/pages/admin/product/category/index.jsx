import ProductCategory from 'component/Modal/ProductCategory'
import AdminLayout from 'component/UI/AdminLayout'
import { useEffect, useState, forwardRef, useRef } from 'react'
import {
  Avatar,
  Content,
  IconButton,
  Input,
  Modal,
  Pagination,
  Popover,
  Stack,
  Table,
  useToaster,
  Whisper,
  Message,
  ButtonGroup,
} from 'rsuite'
import CategoryService from 'service/admin/Category.service'
import { message } from 'src/helper'
import { useCommonStore } from 'src/store/commonStore'
import CheckIcon from '@rsuite/icons/Check'
import CloseIcon from '@rsuite/icons/Close'
import EditIcon from '@rsuite/icons/Edit'
import PlusIcon from '@rsuite/icons/Plus'
import TrashIcon from '@rsuite/icons/Trash'
import Category from 'component/Modal/Category'

const { Column, HeaderCell, Cell } = Table

const CustomRenderCell = ({ rowData, dataKey, ...props }) => {
  return (
    <Cell {...props} style={{ padding: 0 }}>
      <div
        style={{
          borderRadius: 6,
          marginTop: 2,
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Avatar src={`${process.env.API}${rowData[dataKey]?.src}`} />
      </div>
    </Cell>
  )
}

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
  const [data, setData] = useState([])
  const [filterData, setFilterData] = useState([])

  const [limit, setLimit] = useState(10)

  const [page, setPage] = useState(1)

  const [loading, setLoading] = useState(false)

  const [modal, setModal] = useState({
    open: false,
    component: null,
  })

  const [filter, setFilter] = useState('')

  const toaster = useToaster()

  useEffect(() => {
    getCateData()
    changeTitle('Page Danh mục')
  }, [])

  useEffect(() => {
    if (Object.keys(filter)) {
      const dataFilter = [...data]
      if (filter) dataFilter = dataFilter.filter((item) => item.name?.toLowerCase().includes(filter?.toLowerCase()))
      setFilterData(dataFilter)
    } else {
      setFilterData(data)
    }
  }, [filter])

  const getCateData = async () => {
    try {
      setLoading(true)
      let resp = await CategoryService.getProdCate()
      setData(resp.data.data)
      setFilterData(resp.data.data)
    } catch (error) {
      console.log('error', error?.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChangeLimit = (dataKey) => {
    setPage(1)
    setLimit(dataKey)
  }

  const getCategoryById = async (_id) => {
    try {
      let resp = await CategoryService.getProdCateById(_id)
      return resp.data.data
    } catch (error) {
      console.log('getProductById', error)
    }
  }

  const onCreate = async (value) => {
    try {
      setLoading(true)
      const resp = await CategoryService.createProdCate(value)
      if (resp.status === 200) {
        toaster.push(message('success', resp.data.message), { placement: 'topEnd' })
        handleClose()
      }
    } catch (error) {
      toaster.push(
        message(
          'error',
          error.response?.data?.message || error.message || 'Đã có lỗi xảy ra, vui lòng liên hệ quản trị viên',
        ),
        { placement: 'topEnd' },
      )
      handleClose()
    } finally {
      getCateData()
    }
  }

  const onUpdate = async ({ _id, ...val }) => {
    try {
      const resp = await CategoryService.updateProdCateById(_id, val)

      if (resp.status === 200) {
        console.log('update success')
        if (resp.status === 200) {
          toaster.push(message('success', resp.data.message), { placement: 'topEnd' })
          handleClose()
        }
      } else throw resp
    } catch (error) {
      toaster.push(message('error', error.response?.data?.message || error.response?.message), {
        placement: 'topEnd',
      })
      console.log('error updating category', error)
    } finally {
      getCateData()
    }
  }

  const handleOpenCategory = async (rowData) => {
    let data = await getCategoryById(rowData._id)
    setModal({
      open: true,
      component: <ProductCategory data={data} onSubmit={onUpdate} />,
    })
  }

  const handleClose = () => setModal({ ...modal, open: false })

  const getData = () => {
    return filterData.filter((v, i) => {
      const start = limit * (page - 1)
      const end = start + limit
      return i >= start && i < end
    })
  }

  const handleDelete = async (rowData) => {
    try {
      const resp = await CategoryService.deleteProdCateById(rowData._id)
      if (resp.status === 200) {
        console.log('update success')
        if (resp.status === 200) {
          toaster.push(message('success', resp.data.message), { placement: 'topEnd' })
          handleClose()
        }
      } else throw resp
    } catch (error) {
      toaster.push(message('error', error.response?.data?.message || error.response?.message), {
        placement: 'topEnd',
      })
      console.log('error updating category', error)
    } finally {
      getCateData()
    }
  }

  return (
    <>
      <Stack spacing={10} className="py-2">
        <span>Tìm kiếm: </span>
        <Input placeholder="Tên danh mục" onChange={(v) => setFilter(v)} />
      </Stack>

      <Content className={'bg-w'}>
        <Table data={getData()} loading={loading} height={60 * (10 + 1)} rowHeight={60}>
          <Column width={150}>
            <HeaderCell></HeaderCell>
            <CustomRenderCell dataKey="image" />
          </Column>

          <Column width={150} flexGrow={1}>
            <HeaderCell>Danh mục</HeaderCell>
            <Cell dataKey="name" />
          </Column>

          <Column width={150} flexGrow={1}>
            <HeaderCell>Mô tả</HeaderCell>
            <Cell dataKey="description" />
          </Column>
          <Column width={100} flexGrow={1}>
            <HeaderCell>Đường dẫn </HeaderCell>
            <Cell dataKey="slug" />
          </Column>

          <Column fixed="right" align="center">
            <HeaderCell>
              <IconButton
                icon={<PlusIcon />}
                size="xs"
                color="blue"
                appearance="primary"
                onClick={() =>
                  setModal({
                    open: true,
                    component: <ProductCategory onSubmit={onCreate} />,
                  })
                }
              />
            </HeaderCell>

            <ActionCell onDelete={handleDelete} onEdit={handleOpenCategory} right={0} />
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
