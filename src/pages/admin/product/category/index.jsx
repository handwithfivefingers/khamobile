import AdminLayout from 'component/UI/AdminLayout'
import { useEffect, useState, useRef } from 'react'
import { Avatar, Content, Table, DOMHelper } from 'rsuite'
import CategoryService from 'service/admin/Category.service'
import TOAST_STATUS from 'src/constant/message.constant'
import { useCommonStore } from 'src/store/commonStore'
import { useMessageStore } from 'src/store/messageStore'
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
        <Avatar src={`/public/${rowData[dataKey]}`} />
      </div>
    </Cell>
  )
}

const Products = () => {
  const changeTitle = useCommonStore((state) => state.changeTitle)
  const [data, setData] = useState()

  const [loading, setLoading] = useState(false)

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

  return (
    <>
      <Content className={'bg-w h-100'} ref={nodeRef}>
        <Table
          data={data}
          onRowClick={(rowData) => {
            console.log(rowData)
          }}
          loading={loading}
          height={DOMHelper.getHeight(nodeRef.current)}
        >
          <Column width={150}>
            <HeaderCell></HeaderCell>
            <CustomRenderCell dataKey="img" />
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
    </>
  )
}
Products.Admin = AdminLayout

export default Products
