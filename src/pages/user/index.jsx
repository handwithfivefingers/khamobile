import clsx from 'clsx'
import CardBlock from 'component/UI/Content/CardBlock'
import Heading from 'component/UI/Content/Heading'
import { KMInput } from 'component/UI/Content/KMInput'
import PageHeader from 'component/UI/Content/PageHeader'
import { useRouter } from 'next/router'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { Avatar, Button, Form, Nav, Sidenav, Stack, Table, Tag } from 'rsuite'
import AuthenticateService from 'service/authenticate/Authenticate.service'
import GlobalOrderService from 'service/global/Order.service'
import { formatCurrency } from 'src/helper'
import { useAuthorizationStore } from 'src/store/authenticateStore'
import styles from './styles.module.scss'
const { HeaderCell, Cell, Column } = Table

export default function MyOrder() {
  const router = useRouter()
  const [data, setData] = useState()
  const { authenticate, user, changeAuthenticateStatus } = useAuthorizationStore((state) => state)
  const [render, setRender] = useState(false)
  const userData = useRef()
  const orderData = useRef([])
  const userDelivery = useRef()

  const userInformation = useRef()

  const deliveryForm = useRef()
  const informationForm = useRef()
  useEffect(() => {
    if (!authenticate) router.push('/')
    else {
      handleChangeRouter('order')
    }
  }, [])

  useEffect(() => {
    userDelivery.current = {
      ...user.delivery,
    }
    userInformation.current = {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      username: user.username,
    }
  }, [user])

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
    await changeAuthenticateStatus({
      authenticate: false,
    })
    return router.push('/')
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
      const resp = await GlobalOrderService.getOrders()
      const { data } = resp.data
      orderData.current = data
    } catch (error) {
      console.log('getOrder', error)
    } finally {
      setRender(!render)
    }
  }

  const renderByType = () => {
    switch (router.query.type) {
      case 'order':
        return <UserOrder data={orderData.current} />
      case 'address':
        return <AddressInformation data={userDelivery.current} />
      case 'information':
        return <UserInformation data={userInformation.current} />
    }
  }

  console.log('rendered', user)
  return (
    <div className="row p-0">
      <div className="col-12 p-0">
        <PageHeader type="h3" left>
          T??i kho???n
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
                          ????n h??ng
                        </Nav.Item>
                        <Nav.Item
                          onClick={() => handleChangeRouter('address')}
                          className={clsx(styles.navItem, { [styles.active]: router.query.type === 'address' })}
                        >
                          ?????a ch???
                        </Nav.Item>
                        <Nav.Item
                          onClick={() => handleChangeRouter('information')}
                          className={clsx(styles.navItem, { [styles.active]: router.query.type === 'information' })}
                          as={'div'}
                        >
                          T??i kho???n
                        </Nav.Item>
                        <Nav.Item onClick={logout}>Tho??t</Nav.Item>
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

const UserOrder = ({ data, ...props }) => {
  return (
    <>
      <Heading type="h5" className={styles.header}>
        Qu???n l?? ????n h??ng
      </Heading>
      <Table data={data || []}>
        <Column align="left" flexGrow={1}>
          <HeaderCell>T??n s???n ph???m</HeaderCell>
          <Cell dataKey="product">
            {(rowData) => (
              <span>
                {rowData.product?.map((_prod) => (
                  <Tag>{_prod?.productId?.title || _prod?.variantId?.parentId?.title}</Tag>
                ))}
              </span>
            )}
          </Cell>
        </Column>
        <Column align="center" flexGrow={1}>
          <HeaderCell>M?? t???</HeaderCell>
          <Cell>
            {(rowData) => (
              <span>
                {rowData.product?.map(
                  (_prod) =>
                    _prod?.variantId?.attributes &&
                    Object.keys(_prod?.variantId?.attributes).map((key) => (
                      <Tag>{_prod?.variantId?.attributes[key]}</Tag>
                    )),
                )}
              </span>
            )}
          </Cell>
        </Column>
        <Column width={100} align="center">
          <HeaderCell>Thanh to??n</HeaderCell>
          <Cell dataKey="status">{(rowData) => <Tag>{rowData?.status}</Tag>}</Cell>
        </Column>
        <Column width={150} align="right">
          <HeaderCell>Gi?? ti???n</HeaderCell>
          <Cell dataKey="amount">{(rowData) => <span>{formatCurrency(rowData?.amount, { symbol: ' ??' })}</span>}</Cell>
        </Column>
        <Column width={60} align="center">
          <HeaderCell>...</HeaderCell>
          <Cell />
        </Column>
      </Table>
    </>
  )
}

const AddressInformation = ({ data, ...props }) => {
  const [formVal, setFormVal] = useState(data)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    console.log('handleSubmit', formVal)

    try {
      setLoading(true)
      const resp = await AuthenticateService.changeDelivery(formVal)
      console.log(resp)
    } catch (error) {
      console.log('submit error', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Heading type="h5" className={styles.header}>
        C???p nh???t ?????a ch??? giao h??ng
      </Heading>

      <Form key={['user', 'delivery']} formValue={formVal} layout="horizontal" onChange={(val) => setFormVal(val)}>
        <KMInput name="company" label="C??ng ty" />
        <KMInput name="address_1" label="?????a ch??? 1" />
        <KMInput name="address_2" label="?????a ch??? 2" />
        <KMInput name="city" label="Th??nh ph???" />
        <KMInput name="postCode" label="M?? b??u ??i???n" />
        <Form.Group>
          <Form.ControlLabel>{''}</Form.ControlLabel>
          <Button style={{ background: 'var(--rs-blue-800)', color: 'white' }} onClick={handleSubmit} loading={loading}>
            C???p nh???t
          </Button>
        </Form.Group>
      </Form>
    </>
  )
}

const UserInformation = ({ data, ...props }) => {
  const [formVal, setFormVal] = useState(data)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    console.log('handleSubmit', formVal)
    try {
      setLoading(true)
      const resp = await AuthenticateService.changeInformation(formVal)
      console.log(resp)
    } catch (error) {
      console.log('submit error', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Heading type="h5" className={styles.header}>
        C???p nh???t th??ng tin c?? nh??n
      </Heading>
      <Form key={['user', 'information']} formValue={formVal} layout="horizontal" onChange={(val) => setFormVal(val)}>
        <KMInput name="username" label="Nickname" />
        <KMInput name="fullName" label="H??? v?? t??n" />
        <KMInput name="email" label="?????a ch??? email" />
        <KMInput name="phone" label="S??? ??i???n tho???i" />
        <Form.Group>
          <Form.ControlLabel>{''}</Form.ControlLabel>
          <Button style={{ background: 'var(--rs-blue-800)', color: 'white' }} onClick={handleSubmit} loading={loading}>
            C???p nh???t
          </Button>
        </Form.Group>
      </Form>
    </>
  )
}
