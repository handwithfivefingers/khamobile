import ProductCategory from 'component/Modal/ProductCategory'
import AdminLayout from 'component/UI/AdminLayout'
import { useEffect, useRef, useState } from 'react'
import { Avatar, Content, Input, Message, Modal, Pagination, SelectPicker, Stack, Table, useToaster } from 'rsuite'
import CategoryService from 'service/admin/Category.service'
import { useCommonStore } from 'src/store/commonStore'

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

  const nodeRef = useRef()

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
      let resp = await CategoryService.getProdCate()
      setData(resp.data.data)
      setFilterData(resp.data.data)
    } catch (error) {
      console.log('error', error?.response?.data?.message)
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

  const handleOpenCategory = async (rowData) => {
    let data = await getCategoryById(rowData._id)
    setModal({
      open: true,
      component: <ProductCategory data={data} onSubmit={onUpdate} />,
    })
  }

  const handleClose = () => setModal({ ...modal, open: false })

  const message = (type, header) => <Message showIcon type={type} header={header} closable />


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
    }
  }

  const getData = () => {
    return filterData.filter((v, i) => {
      const start = limit * (page - 1)
      const end = start + limit
      return i >= start && i < end
    })
  }

  return (
    <>
      <Stack spacing={10} className="py-2">
        <span>Tìm kiếm: </span>
        <Input placeholder="Tên danh mục" onChange={(v) => setFilter(v)} />
      </Stack>

      <Content className={'bg-w'} ref={nodeRef}>
        <Table data={getData()} onRowClick={handleOpenCategory} loading={loading} height={60 * (10 + 1)} rowHeight={60}>
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

          <Column width={80} fixed="right">
            <HeaderCell>...</HeaderCell>

            <Cell>
              {(rowData) => (
                <span>
                  <a onClick={() => alert(`id:${rowData.id}`)}> Edit </a>
                </span>
              )}
            </Cell>
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
