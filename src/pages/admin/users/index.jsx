import AdminLayout from 'component/UI/AdminLayout'
import { useEffect, useState } from 'react'
import { Content, Table } from 'rsuite'
import UserService from 'service/admin/User.service'
import { useCommonStore } from 'src/store/commonStore'
const { Column, HeaderCell, Cell } = Table

const Users = () => {
  const changeTitle = useCommonStore((state) => state.changeTitle)
  const [data, setData] = useState()
  const [loading, setLoading] = useState()

  useEffect(() => {
    changeTitle('Page Users')
    getUserData()
  }, [])

  const getUserData = async () => {
    try {
      setLoading(true)
      const res = await UserService.getUser()
      setData(res.data.data)
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Content className={'bg-w'}>
        <Table
          height={400}
          data={data}
          onRowClick={(rowData) => {
            console.log(rowData)
          }}
          bordered
          cellBordered
          loading={loading}
        >
          <Column align="center" fixed flexGrow={1}>
            <HeaderCell>Id</HeaderCell>
            <Cell dataKey="_id" />
          </Column>

          <Column flexGrow={1}>
            <HeaderCell>Username</HeaderCell>
            <Cell dataKey="username" />
          </Column>

          <Column flexGrow={1}>
            <HeaderCell>Email</HeaderCell>
            <Cell dataKey="email" />
          </Column>

          <Column width={80} fixed="right">
            <HeaderCell>...</HeaderCell>

            <Cell>
              {(rowData) => (
                <span>
                  <a onClick={() => alert(`id:${rowData._id}`)}> Edit </a>
                </span>
              )}
            </Cell>
          </Column>
        </Table>
      </Content>
    </>
  )
}
Users.Admin = AdminLayout

export default Users
