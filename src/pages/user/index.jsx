import clsx from 'clsx'
import CardBlock from 'component/UI/Content/CardBlock'
import Heading from 'component/UI/Content/Heading'
import { KMInput } from 'component/UI/Content/KMInput'
import PageHeader from 'component/UI/Content/PageHeader'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { Avatar, Button, Form, Nav, Sidenav, Stack, Table } from 'rsuite'
import AuthenticateService from 'service/authenticate/Authenticate.service'
import GlobalOrderService from 'service/global/Order.service'
import { useAuthorizationStore } from 'src/store/authenticateStore'
import styles from './styles.module.scss'
const { HeaderCell, Cell, Column } = Table

export default function MyOrder() {
  const router = useRouter()
  const [data, setData] = useState()
  const { authenticate, user } = useAuthorizationStore((state) => state)
  const userData = useRef()
  useEffect(() => {
    if (!authenticate) router.push('/')
    else {
      handleChangeRouter('order')
    }
  }, [])

  useEffect(() => {
    if (router.query.type) {
      handleGetItemByQuery(router.query.type)
    }
  }, [router.query.type])

  const handleChangeRouter = (routerName) => {
    return router.push(`/user?type=${routerName}`, undefined, { shallow: true })
  }

  const logout = async () => {
    await AuthenticateService.logout()
    return router.push('/')
  }

  const renderByType = () => {
    switch (router.query.type) {
      case 'order':
        return (
          <>
            <Heading type="h5" className={styles.header}>
              Quản lý đơn hàng
            </Heading>
            <Table>
              <Column width={60} align="center" flexGrow={1}>
                <HeaderCell>Id</HeaderCell>
                <Cell dataKey="_id" />
              </Column>
              <Column width={60} align="center" flexGrow={1}>
                <HeaderCell>Tên sản phẩm</HeaderCell>
                <Cell dataKey="_id" />
              </Column>
              <Column width={60} align="center" flexGrow={1}>
                <HeaderCell>Mô tả</HeaderCell>
                <Cell dataKey="_id" />
              </Column>
              <Column width={60} align="center" flexGrow={1}>
                <HeaderCell>Trạng thái Thanh toán</HeaderCell>
                <Cell dataKey="_id" />
              </Column>
              <Column width={60} align="center" flexGrow={1}>
                <HeaderCell>...</HeaderCell>
                <Cell />
              </Column>
            </Table>
          </>
        )
      case 'address':
        return (
          <>
            <Heading type="h5" className={styles.header}>
              Cập nhật địa chỉ giao hàng
            </Heading>

            <Form formValue={user.delivery || {}} layout="horizontal">
              <KMInput name="company" label="Công ty" />
              <KMInput name="address_1" label="Địa chỉ 1" />
              <KMInput name="address_2" label="Địa chỉ 2" />
              <KMInput name="city" label="Thành phố" />
              <KMInput name="postCode" label="Mã bưu điện" />
              <Form.Group>
                <Form.ControlLabel>{''}</Form.ControlLabel>
                <Button style={{ background: 'var(--rs-blue-800)', color: 'white' }}>Cập nhật</Button>
              </Form.Group>
            </Form>
          </>
        )
      case 'information':
        return (
          <>
            <Heading type="h5" className={styles.header}>
              Cập nhật thông tin cá nhân
            </Heading>
            <Form
              formValue={user || {}}
              layout="horizontal"
              onChange={({ username, fullName, email, phone }) =>
                (userData.current = { username, fullName, email, phone })
              }
            >
              <KMInput name="username" label="Nickname" />
              <KMInput name="fullName" label="Họ và tên" />
              <KMInput name="email" label="Địa chỉ email" />
              <KMInput name="phone" label="Số điện thoại" />
              <Form.Group>
                <Form.ControlLabel>{''}</Form.ControlLabel>
                <Button style={{ background: 'var(--rs-blue-800)', color: 'white' }}>Cập nhật</Button>
              </Form.Group>
            </Form>
          </>
        )
    }
  }

  const handleGetItemByQuery = (nameRouter) => {
    switch (nameRouter) {
      case 'order':
        return getOrder()
      case 'address':
        return null
      case 'information':
        return <>hello information</>
    }
  }

  const getOrder = async () => {
    try {
      const data = await GlobalOrderService.getOrders()

      console.log(data)
    } catch (error) {
      console.log('getOrder', error)
    }
  }

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
            <div className="col-12 col-md-4 col-lg-3 col-xl-2">
              <Stack spacing={8} direction="column" justifyContent="center" alignItems="center">
                <Stack.Item className="d-flex align-items-center" style={{ gap: 6 }}>
                  <Avatar src="https://avatars.githubusercontent.com/u/12592949" alt="@superman66" />
                  <span>User name</span>
                </Stack.Item>
                <Stack.Item className="d-flex align-items-center w-100" style={{ gap: 6 }}>
                  <Sidenav defaultOpenKeys={['3']} appearance="subtle" className={'position-sticky top-0 w-100'}>
                    <Sidenav.Body>
                      <Nav>
                        <Nav.Item
                          onClick={() => handleChangeRouter('order')}
                          className={clsx(styles.navItem, { [styles.active]: router.query.type === 'order' })}
                        >
                          Đơn hàng
                        </Nav.Item>
                        <Nav.Item
                          onClick={() => handleChangeRouter('address')}
                          className={clsx(styles.navItem, { [styles.active]: router.query.type === 'address' })}
                        >
                          Địa chỉ
                        </Nav.Item>
                        <Nav.Item
                          onClick={() => handleChangeRouter('information')}
                          className={clsx(styles.navItem, { [styles.active]: router.query.type === 'information' })}
                          as={'div'}
                        >
                          Tài khoản
                        </Nav.Item>
                        <Nav.Item onClick={logout}>Thoát</Nav.Item>
                      </Nav>
                    </Sidenav.Body>
                  </Sidenav>
                </Stack.Item>
              </Stack>
            </div>

            <div className="col-12 col-md-8 col-lg-9 col-xl-10">
              <CardBlock className={clsx('border-0', styles.main)}>{renderByType()}</CardBlock>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
