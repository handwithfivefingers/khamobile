import AdminLayout from 'component/UI/AdminLayout'
import { useEffect, useRef, useState } from 'react'
import { Avatar, Content, IconButton, Input, Modal, Pagination, Stack, Table, useToaster } from 'rsuite'
import CategoryService from 'service/admin/Category.service'
import { useCommonStore } from 'src/store/commonStore'
// import styles from './styles.module.scss'
import PlusIcon from '@rsuite/icons/Plus'
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

const PostCategory = () => {
  const changeTitle = useCommonStore((state) => state.changeTitle)

  const [data, setData] = useState([])

  const treeRef = useRef()

  const [filterData, setFilterData] = useState([])

  const [limit, setLimit] = useState(10)

  const [page, setPage] = useState(1)

  const [loading, setLoading] = useState(false)

  const [modal, setModal] = useState({
    size: 'lg',
    open: false,
    component: null,
  })

  const [filter, setFilter] = useState('')

  const toaster = useToaster()

  useEffect(() => {
    getCateData()
    changeTitle('Danh mục bài viết')
  }, [])

  const getCateData = async () => {
    try {
      setLoading(true)

      const res = await CategoryService.getCate({ type: 'post' })

      let { data } = res.data

      setData(data)
    } catch (error) {
      console.log('error', error?.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  const getCateById = async (id) => {
    try {
      setLoading(true)

      const res = await CategoryService.getCateById(id)

      let { data } = res.data

      setForm({ ...data, parentCategory: [data.parentCategory] })
    } catch (error) {
      console.log('error', error?.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  const getData = () => []

  const handleOpenCategory = async (rowData) => {
    let data = await getCategoryById(rowData._id)
    setModal({
      open: true,
      component: <Category data={data} onSubmit={onUpdate} />,
    })
  }

  const handleChangeLimit = () => {}

  const handleClose = () => {
    setModal((prev) => ({ ...prev, open: false }))
  }

  const onCreate = (v) => console.log('onCreate', v)
  return (
    <>
      <Stack spacing={10} className="py-2">
        <span>Tìm kiếm: </span>
        <Input placeholder="Tên danh mục" onChange={(v) => setFilter(v)} />
      </Stack>

      <Content className={'bg-w'}>
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
            <HeaderCell>
              <IconButton
                icon={<PlusIcon />}
                size="xs"
                color="blue"
                appearance="primary"
                onClick={() =>
                  setModal({
                    open: true,
                    size: 'md',
                    component: <Category onSubmit={onCreate} listCategory={[]} />,
                  })
                }
              />
            </HeaderCell>

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

      <Modal size={modal.size} open={modal.open} onClose={handleClose} keyboard={false} backdrop={'static'}>
        <Modal.Header>
          <Modal.Title>Create</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modal?.component}</Modal.Body>
      </Modal>
    </>
  )
}
PostCategory.Admin = AdminLayout

export default PostCategory
