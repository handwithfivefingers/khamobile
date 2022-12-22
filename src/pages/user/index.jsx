import clsx from 'clsx'
import CardBlock from 'component/UI/Content/CardBlock'
import PageHeader from 'component/UI/Content/PageHeader'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Avatar, Nav, Sidenav, Stack, Table } from 'rsuite'
import styles from './styles.module.scss'
const { HeaderCell, Cell, Column } = Table

export default function MyOrder() {
  const router = useRouter()
  const [data, setData] = useState()
  useEffect(() => {
    handleChangeRouter('order')
  }, [])

  useEffect(() => {
    if (router.query.type) {
      handleGetItemByQuery(router.query.type)
    }
  }, [router.query.type])

  const handleChangeRouter = (routerName) => {
    return router.push(`/user?type=${routerName}`, undefined, { shallow: true })
  }
  const logout = () => {
    console.log('logout')
  }

  const renderByType = () => {
    switch (router.query.type) {
      case 'order':
        return <>hello order</>
      case 'address':
        return <>hello address</>
      case 'information':
        return <>hello information</>
    }
  }

  const handleGetItemByQuery = (nameRouter) => {}

  return (
    <div className="row p-0">
      <div className="col-12 p-0">
        <PageHeader type="h3" left>
          Tài khoản
        </PageHeader>
      </div>
      <div className="col-12 p-0 py-2 border-top">
        <div className="container">
          <div className="row">
            <div className="col-2">
              <Stack spacing={8} direction="column" justifyContent="center" alignItems="center">
                <Stack.Item className="d-flex align-items-center" style={{ gap: 6 }}>
                  <Avatar src="https://avatars.githubusercontent.com/u/12592949" alt="@superman66" />
                  <span>User name</span>
                </Stack.Item>

                <Sidenav defaultOpenKeys={['3']} appearance="subtle" className={'position-sticky top-0'}>
                  <Sidenav.Body>
                    <Nav>
                      <Nav.Item onClick={() => handleChangeRouter('order')}>Đơn hàng</Nav.Item>
                      <Nav.Item onClick={() => handleChangeRouter('address')}>Địa chỉ</Nav.Item>
                      <Nav.Item onClick={() => handleChangeRouter('information')}>Tài khoản</Nav.Item>
                      <Nav.Item onClick={() => logout()}>Thoát</Nav.Item>
                    </Nav>
                  </Sidenav.Body>
                </Sidenav>
              </Stack>
            </div>

            <div className="col-10">
              <CardBlock className={clsx('border-0', styles.main)}>{renderByType()}</CardBlock>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
