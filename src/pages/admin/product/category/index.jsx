import ProductCategory from 'component/Modal/ProductCategory'
import AdminLayout from 'component/UI/AdminLayout'
import { useEffect, useRef, useState } from 'react'
import { Avatar, Content, Modal, Table } from 'rsuite'
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
  const [data, setData] = useState()

  const [loading, setLoading] = useState(false)

  const [modal, setModal] = useState({
    open: false,
    component: null,
  })

  const nodeRef = useRef()

  useEffect(() => {
    getCateData()
    changeTitle('Page Danh mục')
  }, [])

  const getCateData = async () => {
    try {
      let resp = await CategoryService.getProdCate()
      setData(resp.data.data)
    } catch (error) {
      console.log('error', error?.response?.data?.message)
    }
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

  const onUpdate = async ({ _id, ...val }) => {
    try {
      const resp = await CategoryService.updateProdCateById(_id, val)

      if (resp.status === 200) {
        console.log('update success')
      }
    } catch (error) {
      console.log('error updating category', error)
    }
  }

  return (
    <>
      <Content className={'bg-w h-100'} ref={nodeRef}>
        <Table data={data} onRowClick={handleOpenCategory} loading={loading} fillHeight>
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
