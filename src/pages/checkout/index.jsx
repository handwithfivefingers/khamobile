import PageHeader from 'component/UI/Content/PageHeader'
import JsonViewer from 'component/UI/JsonViewer'
import { useRouter } from 'next/router'
import React, { useState, useEffect, useRef } from 'react'
import { Button, ButtonGroup, Form, List, Panel, Placeholder, Radio, RadioGroup, Table, Schema } from 'rsuite'
import GlobalOrderService from 'service/global/Order.service'
import GlobalProductService from 'service/global/Product.service'
import { formatCurrency } from 'src/helper'
import styles from './styles.module.scss'
const { HeaderCell, Cell, Column } = Table

export default function Checkout() {
  const formRef = useRef()
  const router = useRouter()
  const [form, setForm] = useState({
    deliveryType: 'cod',
    userType: 'login',
  })

  const [price, setPrice] = useState(0)

  const model = Schema.Model({
    deliveryType: Schema.Types.StringType().isRequired('Dịch vụ giao hàng không chính xác, vui lòng thử lại'),
    firstName: Schema.Types.StringType().isRequired('Tên không chính xác,vui lòng thử lại'),
    lastName: Schema.Types.StringType().isRequired('Họ và tên lót không chính xác, vui lòng thử lại'),
    email: Schema.Types.StringType().isRequired('Địa chỉ email không chính xác,vui lòng thử lại'),
    phone: Schema.Types.StringType().isRequired('Số điện thoại không chính xác,vui lòng thử lại'),
    address_1: Schema.Types.StringType().isRequired('Địa chỉ giao hàng không chính xác,vui lòng thử lại'),
    city: Schema.Types.StringType().isRequired('Thành phố không chính xác,vui lòng thử lại'),
    postCode: Schema.Types.StringType().isRequired('Mã vùng không chính xác,vui lòng thử lại'),
  })

  useEffect(() => {
    let item = JSON.parse(localStorage.getItem('khaMobileCart'))
    if (item) {
      handleGetListItemPrice(item)
      // setForm({
      //   ...form,
      //   product: item,
      // })

      // let data = handleGetListItemPrice(item)
      // console.log(data)
      // const totalPrice = item.reduce((prev, current) => {
      //   prev += +current?.price * +current?.quantity
      //   return prev
      // }, 0)

      // setPrice({
      //   total: totalPrice,
      //   subTotal: totalPrice,
      // })
    }
  }, [])

  const handleGetListItemPrice = async (item) => {
    try {
      let groupItem = item.map((item) => getScreenData(item?._id, item?.variantId, item?.quantity))
      let resp = await Promise.all(groupItem)

      const totalPrice = resp?.reduce((prev, current) => {
        prev += +current?.price * +current?.quantity
        return prev
      }, 0)

      setForm({
        ...form,
        amount: totalPrice,
        product: resp,
      })

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
      if (!formRef.current.check()) {
        console.error('Form Error')
        return
      }

      const resp = await GlobalOrderService.createOrderAnonymous(form)
      if (resp.data.orderId) {
        localStorage.setItem('khaMobileCart', null)
        router.push(`/checkout/${resp.data.orderId}`)
      }
    } catch (error) {
      console.log('handleSaveOrder', error)
    }
  }
  const handleLogin = () => {
    console.log(form)
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
          <Form
            className="row gx-4  gy-4"
            formValue={form}
            onChange={(formVal) => setForm(formVal)}
            model={model}
            ref={formRef}
          >
            <div className="col-12 col-md-6 col-lg-4">
              <div className="row gy-4">
                <div className="col-12">
                  <Panel header={<h5>Tài khoản</h5>} bordered>
                    <Form.Group controlId="userType">
                      <RadioGroup
                        name="userType"
                        onChange={(val) => setForm({ ...form, userType: val })}
                        value={form.userType}
                        inline
                      >
                        <Radio value="login">Đăng nhập</Radio>
                        <Radio value="register">Đăng kí</Radio>
                        <Radio value="anonymous">Khách</Radio>
                      </RadioGroup>
                    </Form.Group>
                  </Panel>
                </div>

                {form.userType === 'login' ? (
                  <div className="col-12">
                    <Panel header={<h5>Đăng nhập</h5>} bordered>
                      <Form.Group controlId="username">
                        <Form.ControlLabel>
                          Tên tài khoản <span style={{ color: 'var(--rs-red-500)' }}>*</span>
                        </Form.ControlLabel>
                        <Form.Control name="username" />
                      </Form.Group>

                      <Form.Group controlId="password">
                        <Form.ControlLabel>
                          Mật khẩu <span style={{ color: 'var(--rs-red-500)' }}>*</span>
                        </Form.ControlLabel>
                        <Form.Control name="password" />
                      </Form.Group>
                      <Button
                        onClick={handleLogin}
                        color="blue"
                        style={{ background: 'var(--rs-blue-800)', color: '#fff', display: 'flex', marginLeft: 'auto' }}
                      >
                        Đăng nhập
                      </Button>
                    </Panel>
                  </div>
                ) : (
                  <>
                    <div className="col-12">
                      <Panel header={<h5>Thông tin cá nhân</h5>} bordered>
                        <Form.Group controlId="firstName">
                          <Form.ControlLabel>
                            Tên <span style={{ color: 'var(--rs-red-500)' }}>*</span>
                          </Form.ControlLabel>
                          <Form.Control name="firstName" />
                        </Form.Group>
                        <Form.Group controlId="lastName">
                          <Form.ControlLabel>
                            Họ và tên lót <span style={{ color: 'var(--rs-red-500)' }}>*</span>
                          </Form.ControlLabel>
                          <Form.Control name="lastName" />
                        </Form.Group>
                        <Form.Group controlId="email">
                          <Form.ControlLabel>
                            Địa chỉ email <span style={{ color: 'var(--rs-red-500)' }}>*</span>
                          </Form.ControlLabel>
                          <Form.Control name="email" />
                        </Form.Group>
                        <Form.Group controlId="phone">
                          <Form.ControlLabel>
                            Số điện thoại <span style={{ color: 'var(--rs-red-500)' }}>*</span>
                          </Form.ControlLabel>
                          <Form.Control name="phone" />
                        </Form.Group>
                      </Panel>
                    </div>
                    <div className="col-12">
                      <Panel bordered header={<h5>Địa chỉ giao hàng/ thanh toán</h5>}>
                        {/* <Placeholder.Paragraph rows={15} /> */}
                        <Form.Group controlId="company">
                          <Form.ControlLabel>Công ty</Form.ControlLabel>
                          <Form.Control name="company" />
                        </Form.Group>
                        <Form.Group controlId="address_1">
                          <Form.ControlLabel>Địa chỉ 1</Form.ControlLabel>
                          <Form.Control name="address_1" />
                        </Form.Group>
                        <Form.Group controlId="address_2">
                          <Form.ControlLabel>Địa chỉ 2</Form.ControlLabel>
                          <Form.Control name="address_2" />
                        </Form.Group>

                        <Form.Group controlId="city">
                          <Form.ControlLabel>Tỉnh/ Thành phố</Form.ControlLabel>
                          <Form.Control name="city" />
                        </Form.Group>

                        <Form.Group controlId="postCode">
                          <Form.ControlLabel>Mã vùng</Form.ControlLabel>
                          <Form.Control name="postCode" />
                        </Form.Group>
                      </Panel>
                    </div>
                  </>
                )}
                {/* <div className="col-12">
                  <Panel header={<h5>Thông tin cá nhân</h5>} bordered>
                    <Form.Group controlId="firstName">
                      <Form.ControlLabel>
                        Tên <span style={{ color: 'var(--rs-red-500)' }}>*</span>
                      </Form.ControlLabel>
                      <Form.Control name="firstName" />
                    </Form.Group>
                    <Form.Group controlId="lastName">
                      <Form.ControlLabel>
                        Họ và tên lót <span style={{ color: 'var(--rs-red-500)' }}>*</span>
                      </Form.ControlLabel>
                      <Form.Control name="lastName" />
                    </Form.Group>
                    <Form.Group controlId="email">
                      <Form.ControlLabel>
                        Địa chỉ email <span style={{ color: 'var(--rs-red-500)' }}>*</span>
                      </Form.ControlLabel>
                      <Form.Control name="email" />
                    </Form.Group>
                    <Form.Group controlId="phone">
                      <Form.ControlLabel>
                        Số điện thoại <span style={{ color: 'var(--rs-red-500)' }}>*</span>
                      </Form.ControlLabel>
                      <Form.Control name="phone" />
                    </Form.Group>
                  </Panel>
                </div>
                <div className="col-12">
                  <Panel bordered header={<h5>Địa chỉ giao hàng/ thanh toán</h5>}>
                    <Form.Group controlId="company">
                      <Form.ControlLabel>Công ty</Form.ControlLabel>
                      <Form.Control name="company" />
                    </Form.Group>
                    <Form.Group controlId="address_1">
                      <Form.ControlLabel>Địa chỉ 1</Form.ControlLabel>
                      <Form.Control name="address_1" />
                    </Form.Group>
                    <Form.Group controlId="address_2">
                      <Form.ControlLabel>Địa chỉ 2</Form.ControlLabel>
                      <Form.Control name="address_2" />
                    </Form.Group>

                    <Form.Group controlId="city">
                      <Form.ControlLabel>Tỉnh/ Thành phố</Form.ControlLabel>
                      <Form.Control name="city" />
                    </Form.Group>

                    <Form.Group controlId="postCode">
                      <Form.ControlLabel>Mã vùng</Form.ControlLabel>
                      <Form.Control name="postCode" />
                    </Form.Group>
                  </Panel>
                </div> */}
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-8">
              <div className="row gx-4 gy-4">
                <div className="col-12">
                  <Panel header={<h5>Phương thức vận chuyển</h5>} className="shadow  bg-white">
                    <Form.Group controlId="radioList">
                      <RadioGroup
                        name="radioList"
                        onChange={(val) => setForm({ ...form, deliveryType: val })}
                        value={form.deliveryType}
                      >
                        <Radio value="cod">COD</Radio>
                      </RadioGroup>
                    </Form.Group>
                  </Panel>
                </div>

                <div className="col-12">
                  <Panel header={<h5>Thông tin đơn hàng</h5>} className="shadow  bg-white">
                    <Table autoHeight data={form?.product} wordWrap="break-word">
                      <Column align="left" verticalAlign="middle" resizable flexGrow={1}>
                        <HeaderCell style={{ background: 'var(--rs-blue-800)', color: 'white' }}>
                          Tên sản phẩm
                        </HeaderCell>
                        <Cell dataKey="title" />
                      </Column>

                      <Column align="center" verticalAlign="middle" resizable width={200}>
                        <HeaderCell style={{ background: 'var(--rs-blue-800)', color: 'white' }}>Đơn giá</HeaderCell>
                        <Cell dataKey="price" />
                      </Column>

                      <Column width={120} verticalAlign="middle" align="center" resizable>
                        <HeaderCell style={{ background: 'var(--rs-blue-800)', color: 'white' }}>Số lượng</HeaderCell>
                        <Cell dataKey="quantity" />
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
                  </Panel>
                </div>
                <div className="col-12">
                  <Panel header={<h5>Hình thức thanh toán</h5>} className="shadow  bg-white">
                    <Form.Group controlId="radioList">
                      <RadioGroup name="radioList" onChange={(val) => setForm({ ...form, paymentType: val })}>
                        <Radio value="transfer">Chuyển khoản</Radio>
                        <Radio value="vnpay">Qua Vn-Pay</Radio>
                      </RadioGroup>
                    </Form.Group>
                  </Panel>
                </div>

                <div className="col-12">
                  <div className={styles.action}>
                    <ButtonGroup>
                      {/* <Button
                        appearance="primary"
                        className={styles.btnIcon}
                        style={{ background: 'var(--rs-blue-800)' }}
                      >
                        Xem lại
                      </Button> */}
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
          </Form>
        </div>
      </div>
      {/* <JsonViewer data={form} /> */}
    </div>
  )
}
