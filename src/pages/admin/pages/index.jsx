import AdminLayout from 'component/UI/AdminLayout'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Content, Table } from 'rsuite'
import PageService from 'service/admin/Page.service'
import { useCommonStore } from 'src/store/commonStore'

const { Column, HeaderCell, Cell } = Table

const Pages = () => {
  const changeTitle = useCommonStore((state) => state.changeTitle)
  const router = useRouter()
  const [page, setPage] = useState([])
  useEffect(() => {
    changeTitle('Page Pages')
    getScreenData()
  }, [])

  const getScreenData = async () => {
    try {
      const resp = await PageService.getPages()
      setPage(resp.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  //   const tableData = [
  //     {
  //       id: 1,
  //       name: 'Homepage',
  //       slug: 'home',
  //     },
  //     {
  //       id: 2,
  //       name: 'Danh mục',
  //       slug: 'category',
  //     },
  //     {
  //       id: 3,
  //       name: 'Sản phẩm',
  //       slug: 'san-pham',
  //     },
  //   ]

  return (
    <>
      <Content className={'bg-w'}>
        <Table
          height={400}
          data={page}
          onRowClick={(rowData) => {
            router.push(`./pages/${rowData._id}`)
          }}
        >
          <Column width={60} align="center" fixed>
            <HeaderCell>Id</HeaderCell>
            <Cell dataKey="_id" />
          </Column>

          <Column width={150}>
            <HeaderCell>Trang</HeaderCell>
            <Cell dataKey="title" />
          </Column>

          <Column width={100}>
            <HeaderCell>Đường dẫn</HeaderCell>
            <Cell dataKey="slug" />
          </Column>

          <Column width={80} fixed="right">
            <HeaderCell>...</HeaderCell>

            <Cell>
              {(rowData) => (
                <span>
                  <a onClick={() => router.push(`/admin/pages/${rowData._id}`)}> Edit </a>
                </span>
              )}
            </Cell>
          </Column>
        </Table>
      </Content>
    </>
  )
}
Pages.Admin = AdminLayout

export default Pages
