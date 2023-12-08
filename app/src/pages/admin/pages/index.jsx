import AdminLayout from 'component/UI/AdminLayout'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Content, IconButton, Table } from 'rsuite'
import PageService from 'service/admin/Page.service'
import { useCommonStore } from 'src/store/commonStore'
import EditIcon from '@rsuite/icons/Edit'

const { Column, HeaderCell, Cell } = Table

const Pages = () => {
  const changeTitle = useCommonStore((state) => state.changeTitle)
  const router = useRouter()
  const [page, setPage] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    changeTitle('Page Pages')
    getScreenData()
  }, [])

  const getScreenData = async () => {
    try {
      setLoading(true)
      const resp = await PageService.getPages()
      const data = [
        ...resp.data.data,
        {
          _id: 'demo',
          title: 'demo',
          slug: 'demo',
        },
      ]
      setPage(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Content className={'bg-w'}>
        <Table height={400} data={page} loading={loading}>
          <Column flexGrow={1}>
            <HeaderCell>Trang</HeaderCell>
            <Cell dataKey="title" />
          </Column>

          <Column flexGrow={1}>
            <HeaderCell>Đường dẫn</HeaderCell>
            <Cell dataKey="slug" />
          </Column>

          <Column width={80} fixed="right">
            <HeaderCell>...</HeaderCell>

            <Cell>
              {(rowData) => (
                <span>
                  <IconButton
                    onClick={() => router.push(`./pages/${rowData._id}`)}
                    size="sm"
                    appearance="primary"
                    icon={<EditIcon />}
                    color="blue"
                    disabled={rowData.slug !== '/' && rowData.slug !== 'demo'}
                  />
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
