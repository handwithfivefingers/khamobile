import CardBlock from 'component/UI/Content/CardBlock'
import { KMInput } from 'component/UI/Content/KMInput'
import PageHeader from 'component/UI/Content/PageHeader'
import { useRouter } from 'next/router'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Button, ButtonGroup, FlexboxGrid, Form, List, Panel, Radio, RadioGroup, Table, Tag } from 'rsuite'
import GlobalOrderService from 'service/global/Order.service'
import GlobalProductService from 'service/global/Product.service'
import { CheckoutModel } from 'src/constant/model.constant'
import { formatCurrency } from 'src/helper'
import { useAuthorizationStore } from 'src/store/authenticateStore'
import { useDevStore } from 'src/store/devStore'
import styles from './styles.module.scss'
const { HeaderCell, Cell, Column } = Table

export default function Checkout() {
  const router = useRouter()

  const { authenticate, user, changeAuthenticateStatus } = useAuthorizationStore((state) => state)

  const [form, setForm] = useState({
    deliveryType: 'cod',
    userType: 'anonymous',
    paymentType: 'transfer',
  })

  const [price, setPrice] = useState(0)
  const deliveryRef = useRef()
  const informationRef = useRef()
  const loginRef = useRef()

  useEffect(() => {
    let item = JSON.parse(localStorage.getItem('khaMobileCart'))
    if (item) {
      handleGetListItemPrice(item)
    }
  }, [])

  useEffect(() => {
    if (authenticate && user) {
      deliveryRef.current = user.delivery
    }
  }, [authenticate, user])

  const handleGetListItemPrice = async (item) => {
    try {
      let groupItem = item.map((item) => getScreenData(item?._id, item?.variantId, item?.quantity))
      let resp = await Promise.all(groupItem)

      const totalPrice = resp?.reduce((prev, current) => {
        prev += +current?.price * +current?.quantity
        return prev
      }, 0)

      setForm((state) => ({
        ...state,
        amount: totalPrice,
        product: resp,
      }))

      setPrice(totalPrice)
    } catch (error) {
      console.log('handleGetListItemPrice', error)
    }
  }

  const getScreenData = async (_id, variantId, quantity) => {
    try {
      let resp = await GlobalProductService.getProductById(_id, variantId)
      return { ...resp.data.data, quantity }
    } catch (error) {
      console.log('getScreenData ', error)
    }
  }

  const handleSaveOrder = async () => {
    try {
      // console.log(formRef.current)
      // if (!formRef.current.check()) {
      //   console.log('Form Error')
      //   return
      // }

      // const resp = await GlobalOrderService.createOrder(form)

      // if (resp.data.orderId) {
      //   localStorage.setItem('khaMobileCart', null)
      //   if (resp.data.urlPayment && form.paymentType === 'vnpay') window.open(resp.data.urlPayment)
      //   else router.push(`/checkout/${resp.data.orderId}`)
      // }
      let deliveryValue = deliveryRef.current
    } catch (error) {
      console.log('handleSaveOrder', error)
    }
  }

  const renderInformationBlock = () => {
    let html = null
    if (authenticate) {
      html = (
        <div className="col-12 p-0">
          <CardBlock className="border" style={{ background: 'transparent', boxShadow: 'unset' }}>
            <FlexboxGrid style={{ gap: 12, flexDirection: 'column' }}>
              <FlexboxGrid.Item style={{ width: '100%' }}>
                <h5>Tài khoản</h5>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item style={{ width: '100%' }} className="w-100">
                <span style={{ color: 'var(--rs-blue-800)' }}>Tên tài khoản: {user.fullName || ''} </span>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item style={{ width: '100%' }} className="w-100">
                <span style={{ color: 'var(--rs-blue-800)' }}>Email: {user.email} </span>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item style={{ width: '100%' }} className="w-100">
                <span style={{ color: 'var(--rs-blue-800)' }}>Phone: {user.phone} </span>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </CardBlock>
        </div>
      )
    } else {
      html = (
        <div className="col-12">
          <CardBlock className="border" style={{ background: 'transparent', boxShadow: 'unset' }}>
            <FlexboxGrid style={{ gap: 12, flexDirection: 'column' }}>
              <FlexboxGrid.Item style={{ width: '100%' }}>
                <h5>Tài khoản</h5>
              </FlexboxGrid.Item>

              <FlexboxGrid.Item style={{ width: '100%' }} className="w-100">
                <Form.Group controlId="userType">
                  <RadioGroup
                    name="userType"
                    onChange={(val) => setForm({ ...form, userType: val })}
                    value={form.userType}
                    inline
                  >
                    <Radio value="anonymous">Khách</Radio>
                    <Radio value="login">Đăng nhập</Radio>
                  </RadioGroup>
                </Form.Group>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </CardBlock>
        </div>
      )
    }
    return html
  }

  const renderUserInformationByCondition = (condition) => {
    let html = null

    if (authenticate) {
      html = <DeliveryInformation ref={deliveryRef} data={deliveryRef.current} />
    } else {
      if (condition === 'login') {
        html = (
          <div className="col-12">
            <LoginForm ref={loginRef} handleLogin={handleLogin} />
          </div>
        )
      } else {
        html = (
          <>
            <div className="col-12">
              <UserInformation ref={informationRef} data={user} />
            </div>

            <div className="col-12">
              <DeliveryInformation ref={deliveryRef} data={deliveryRef.current} />
            </div>
          </>
        )
      }
    }
    return html
  }

  const handleLogin = (value) => {
    // console.log(form)
    console.log(value)
  }

  return (
    <div className="row p-0">
      <div className="col-12 p-0">
        <PageHeader type="h3" left>
          Thanh toán
        </PageHeader>
      </div>
      <div className="col-12 p-0 py-2 border-top">
        <div className="container">
          <div className="row gx-4 gy-4">
            <div className="col-12 col-md-6 col-lg-4 col-xl-3">
              <div className="row gy-4">
                {renderInformationBlock()}
                {renderUserInformationByCondition(form.userType)}
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-8 col-xl-9">
              <div className="row gx-4 gy-4">
                <div className="col-12">
                  <CardBlock className="border-0">
                    <h5>Phương thức vận chuyển</h5>
                    <Form.Group controlId="radioList">
                      <RadioGroup
                        name="radioList"
                        onChange={(val) => setForm({ ...form, deliveryType: val })}
                        value={form.deliveryType}
                      >
                        <Radio value="cod">COD</Radio>
                      </RadioGroup>
                    </Form.Group>
                  </CardBlock>
                </div>

                <div className="col-12">
                  <CardBlock className="border-0">
                    <h5>Thông tin đơn hàng</h5>
                    <Table autoHeight data={form?.product}>
                      <Column align="left" fullText>
                        <HeaderCell style={{ background: 'var(--rs-blue-800)', color: 'white' }}>
                          Tên sản phẩm
                        </HeaderCell>
                        <Cell dataKey="title" />
                      </Column>

                      <Column width={120} align="left">
                        <HeaderCell style={{ background: 'var(--rs-blue-800)', color: 'white' }}>Số lượng</HeaderCell>
                        <Cell dataKey="quantity" />
                      </Column>

                      <Column width={220} align="left">
                        <HeaderCell style={{ background: 'var(--rs-blue-800)', color: 'white' }}>Mô tả</HeaderCell>
                        <Cell dataKey="attributes">
                          {(rowData) =>
                            Object.keys(rowData?.attributes).map((key) => (
                              <>
                                <Tag>{rowData?.attributes[key]}</Tag>
                              </>
                            ))
                          }
                        </Cell>
                      </Column>

                      <Column align="right">
                        <HeaderCell style={{ background: 'var(--rs-blue-800)', color: 'white' }}>Đơn giá</HeaderCell>
                        <Cell dataKey="price" />
                      </Column>
                    </Table>

                    <List>
                      <List.Item
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          color: 'var(--rs-blue-800)',
                        }}
                      >
                        <span style={{ textAlign: 'center', padding: '0px 10px' }}>Tổng cộng:</span>
                        <span style={{ textAlign: 'center', padding: '0px 10px' }}>
                          <b>{formatCurrency(price)}</b>
                        </span>
                      </List.Item>
                    </List>
                  </CardBlock>
                </div>
                <div className="col-12">
                  <CardBlock className="border-0">
                    <h5>Hình thức thanh toán</h5>
                    <Form.Group controlId="radioList">
                      <RadioGroup
                        name="radioList"
                        onChange={(val) => setForm({ ...form, paymentType: val })}
                        value={form.paymentType}
                      >
                        <Radio value="transfer">Chuyển khoản</Radio>
                        <Radio value="vnpay">Qua Vn-Pay</Radio>
                      </RadioGroup>
                    </Form.Group>
                  </CardBlock>
                </div>

                <div className="col-12">
                  <div className={styles.action}>
                    <ButtonGroup>
                      <Button
                        color="red"
                        appearance="primary"
                        className={styles.btnIcon}
                        style={{ background: 'var(--rs-blue-800)', color: '#fff' }}
                        onClick={handleSaveOrder}
                      >
                        Thanh toán
                      </Button>
                    </ButtonGroup>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const UserInformation = forwardRef(({ data, ...props }, ref) => {
  const [state, setState] = useState(data)
  useEffect(() => {
    setState(data)
  }, [data])

  return (
    <CardBlock className="border" style={{ background: 'transparent', boxShadow: 'unset' }}>
      <Form
        formValue={state}
        onChange={(val) => {
          setState(val)
          ref.current = { ...val }
        }}
      >
        <FlexboxGrid style={{ gap: 12, flexDirection: 'column' }}>
          <FlexboxGrid.Item style={{ width: '100%' }}>
            <h5>Thông tin cá nhân</h5>
          </FlexboxGrid.Item>

          <FlexboxGrid.Item style={{ width: '100%' }} className="w-100">
            <KMInput
              name="fullName"
              label={
                <>
                  Họ và tên <span style={{ color: 'var(--rs-red-500)' }}>*</span>
                </>
              }
            />
          </FlexboxGrid.Item>

          <FlexboxGrid.Item style={{ width: '100%' }} className="w-100">
            <KMInput
              name="email"
              label={
                <>
                  Email <span style={{ color: 'var(--rs-red-500)' }}>*</span>
                </>
              }
            />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item style={{ width: '100%' }} className="w-100">
            <KMInput
              name="phone"
              label={
                <>
                  Số điện thoại <span style={{ color: 'var(--rs-red-500)' }}>*</span>
                </>
              }
              mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
              placeholder="0123456789"
              guide={false}
              onChange={(val) => console.log(val)}
              keepCharPositions={true}
            />
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Form>
    </CardBlock>
  )
})

const DeliveryInformation = forwardRef(({ data, ...props }, ref) => {
  const [state, setState] = useState(data)
  useEffect(() => {
    setState(data)
  }, [data])
  return (
    <CardBlock className="border" style={{ background: 'transparent', boxShadow: 'unset' }}>
      <Form
        key={['delivery']}
        formValue={state}
        onChange={(val) => {
          setState(val)
          ref.current = { ...val }
        }}
      >
        <FlexboxGrid.Item style={{ width: '100%' }}>
          <h5>Địa chỉ giao hàng/ thanh toán</h5>
        </FlexboxGrid.Item>

        <FlexboxGrid.Item style={{ width: '100%' }} className="w-100">
          <KMInput
            name="company"
            label={
              <>
                Công ty <span style={{ color: 'var(--rs-red-500)' }}>*</span>
              </>
            }
          />
        </FlexboxGrid.Item>

        <FlexboxGrid.Item style={{ width: '100%' }} className="w-100">
          <KMInput
            name="address_1"
            label={
              <>
                Địa chỉ 1<span style={{ color: 'var(--rs-red-500)' }}>*</span>
              </>
            }
          />
        </FlexboxGrid.Item>

        <FlexboxGrid.Item style={{ width: '100%' }} className="w-100">
          <KMInput name="address_2" label={<>Địa chỉ 2</>} />
        </FlexboxGrid.Item>

        <FlexboxGrid.Item style={{ width: '100%' }} className="w-100">
          <KMInput
            name="city"
            label={
              <>
                Tỉnh/ Thành phố<span style={{ color: 'var(--rs-red-500)' }}>*</span>
              </>
            }
          />
        </FlexboxGrid.Item>
        <FlexboxGrid.Item style={{ width: '100%' }} className="w-100">
          <KMInput
            name="postCode"
            label={
              <>
                Mã vùng<span style={{ color: 'var(--rs-red-500)' }}>*</span>
              </>
            }
            mask={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
            placeholder="xxxxxx"
            guide={true}
            showMask={true}
            onChange={(val) => console.log(val)}
            keepCharPositions={false}
          />
        </FlexboxGrid.Item>
      </Form>
    </CardBlock>
  )
})

const LoginForm = forwardRef((props, ref) => {
  const [state, setState] = useState({})

  console.log('rendered')
  return (
    <CardBlock className="border" style={{ background: 'transparent', boxShadow: 'unset' }}>
      <Form formValue={state} onChange={(val) => setState(val)}>
        <h5>Đăng nhập</h5>
        <Form.Group controlId="username">
          <Form.ControlLabel>
            Tên tài khoản <span style={{ color: 'var(--rs-red-500)' }}>*</span>
          </Form.ControlLabel>
          <Form.Control name="username" className="d-flex flex-1" />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.ControlLabel>
            Mật khẩu <span style={{ color: 'var(--rs-red-500)' }}>*</span>
          </Form.ControlLabel>
          <Form.Control name="password" />
        </Form.Group>
        <Button
          onClick={() => props?.handleLogin(state)}
          color="blue"
          style={{ background: 'var(--rs-blue-800)', color: '#fff', display: 'flex', marginLeft: 'auto' }}
        >
          Đăng nhập
        </Button>
      </Form>
    </CardBlock>
  )
})
