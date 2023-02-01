import AdminLayout from 'component/UI/AdminLayout'
import { useEffect } from 'react'
import { Content, Header, Table } from 'rsuite'
import { useCommonStore } from 'src/store/commonStore'
// import { mockUsers } from './mock';

const { Column, HeaderCell, Cell } = Table

// const data = mockUsers(20);

const Setting = () => {
  const changeTitle = useCommonStore((state) => state.changeTitle)
  useEffect(() => {
    changeTitle('Page Setting')
  }, [])

  return (
    <>

      <Content className={'bg-w'}>
        <Table
          height={400}
          data={[]}
          onRowClick={(rowData) => {
            console.log(rowData)
          }}
        >
          <Column width={60} align="center" fixed>
            <HeaderCell>Id</HeaderCell>
            <Cell dataKey="id" />
          </Column>

          <Column width={150}>
            <HeaderCell>First Name</HeaderCell>
            <Cell dataKey="firstName" />
          </Column>

          <Column width={150}>
            <HeaderCell>Last Name</HeaderCell>
            <Cell dataKey="lastName" />
          </Column>

          <Column width={100}>
            <HeaderCell>Gender</HeaderCell>
            <Cell dataKey="gender" />
          </Column>

          <Column width={100}>
            <HeaderCell>Age</HeaderCell>
            <Cell dataKey="age" />
          </Column>

          <Column width={150}>
            <HeaderCell>Postcode</HeaderCell>
            <Cell dataKey="postcode" />
          </Column>

          <Column width={300}>
            <HeaderCell>Email</HeaderCell>
            <Cell dataKey="email" />
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
Setting.Admin = AdminLayout

export default Setting
