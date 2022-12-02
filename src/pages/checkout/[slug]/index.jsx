// Lê Thành Kha:
// Ngân hàng: Ngân Hàng Techcombank
// Số tài khoản: 0777999966
// Lê Thành Kha:
// Ngân hàng: Ngân Hàng ACB
// Số tài khoản: 1995 9968
// Lê Thành Kha:
// Ngân hàng: Ngân Hàng ACB
// Số tài khoản: 219069729
// Lê Thành Kha:
// Ngân hàng: Ngân Hàng VP Bank
// Số tài khoản: 777999966
// Lê Thành Kha:
// Ngân hàng: Ngân Hàng MB
// Số tài khoản: 1090160069999
// Lê Thành Kha:
// Ngân hàng: Ngân Hàng SCB
// Số tài khoản: 28601259966

import React from 'react'
import axios from 'configs/axiosInstance'
import styles from './styles.module.scss'
import PageHeader from 'component/UI/Content/PageHeader'
import {
  Button,
  ButtonGroup,
  Form,
  IconButton,
  Input,
  List,
  Panel,
  Placeholder,
  Radio,
  RadioGroup,
  Stack,
  Table,
  Tag,
} from 'rsuite'
import JsonViewer from 'component/UI/JsonViewer'
import { useEffect } from 'react'
import { useState } from 'react'
import CharacterAuthorizeIcon from '@rsuite/icons/CharacterAuthorize'
import { formatCurrency } from 'src/helper'
const { HeaderCell, Cell, Column } = Table

const USER_SERVICE = {
  name: 'Lê Thành Kha',
  value: [
    {
      bankName: 'Ngân Hàng Techcombank',
      bankCode: '0777999966',
    },
    {
      bankName: 'Ngân Hàng ACB',
      bankCode: '1995 9968',
    },
    {
      bankName: 'Ngân Hàng ACB',
      bankCode: '219069729',
    },
    {
      bankName: 'Ngân Hàng VP Bank',
      bankCode: '777999966',
    },
    {
      bankName: 'Ngân Hàng MB',
      bankCode: '1090160069999',
    },
    {
      bankName: 'Ngân Hàng SCB',
      bankCode: '28601259966',
    },
  ],
}

export default function OrderReceived({ data }) {
  console.log(data)
  const [form, setForm] = useState(data)

  return (
    <div className="row p-0">
      <div className="col-12 p-0">
        <PageHeader type="h3" left>
          Ordered
        </PageHeader>
      </div>
      <div className="col-12 p-0 py-2 border-top">
        <div className="container">
          <Form className="row gx-4 gy-4" plaintext formValue={data}>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="row gy-4">
                <div className="col-12">
                  <Panel header={<h5>Thông tin cá nhân</h5>} bordered>
                    <Form.Group controlId="firstName">
                      <Form.ControlLabel>
                        Tên <span style={{ color: 'var(--rs-red-500)' }}>*</span>
                      </Form.ControlLabel>
                      <Form.Control name="firstName" value={data['userId']['firstName']} />
                    </Form.Group>
                    <Form.Group controlId="lastName">
                      <Form.ControlLabel>
                        Họ và tên lót <span style={{ color: 'var(--rs-red-500)' }}>*</span>
                      </Form.ControlLabel>
                      <Form.Control name="lastName" value={data['userId']['lastName']} />
                    </Form.Group>
                    <Form.Group controlId="email">
                      <Form.ControlLabel>
                        Địa chỉ email <span style={{ color: 'var(--rs-red-500)' }}>*</span>
                      </Form.ControlLabel>
                      <Form.Control name="email" value={data['userId']['email']} />
                    </Form.Group>
                    <Form.Group controlId="phone">
                      <Form.ControlLabel>
                        Số điện thoại <span style={{ color: 'var(--rs-red-500)' }}>*</span>
                      </Form.ControlLabel>
                      <Form.Control name="phone" value={data['userId']['phone']} />
                    </Form.Group>
                  </Panel>
                </div>
                <div className="col-12">
                  <Panel bordered header={<h5>Địa chỉ giao hàng/ thanh toán</h5>}>
                    <Form.Group controlId="company">
                      <Form.ControlLabel>Công ty</Form.ControlLabel>
                      <Form.Control name="company" value={data['deliveryInformation']['company']} />
                    </Form.Group>
                    <Form.Group controlId="address_1">
                      <Form.ControlLabel>Địa chỉ 1</Form.ControlLabel>
                      <Form.Control name="address_1" value={data['deliveryInformation']['address_1']} />
                    </Form.Group>
                    <Form.Group controlId="address_2">
                      <Form.ControlLabel>Địa chỉ 2</Form.ControlLabel>
                      <Form.Control name="address_2" value={data['deliveryInformation']['address_2']} />
                    </Form.Group>

                    <Form.Group controlId="city">
                      <Form.ControlLabel>Tỉnh/ Thành phố</Form.ControlLabel>
                      <Form.Control name="city" value={data['deliveryInformation']['city']} />
                    </Form.Group>

                    <Form.Group controlId="postCode">
                      <Form.ControlLabel>Mã vùng</Form.ControlLabel>
                      <Form.Control name="postCode" value={data['deliveryInformation']['postCode']} />
                    </Form.Group>
                  </Panel>
                </div>
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
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-8">
              <div className="row gx-4 gy-4">
                <div className="col-12">
                  <Panel header={<h5>Thông tin đơn hàng</h5>} className="shadow  bg-white">
                    <Table autoHeight data={form?.product} wordWrap="break-word">
                      <Column align="left" verticalAlign="middle" resizable flexGrow={1}>
                        <HeaderCell style={{ background: 'var(--rs-blue-700)', color: 'white' }}>
                          Tên sản phẩm
                        </HeaderCell>
                        <Cell dataKey="title" />
                      </Column>

                      <Column align="center" verticalAlign="middle" resizable width={200}>
                        <HeaderCell style={{ background: 'var(--rs-blue-700)', color: 'white' }}>Đơn giá</HeaderCell>
                        <Cell dataKey="price" />
                      </Column>

                      <Column width={120} verticalAlign="middle" align="center" resizable>
                        <HeaderCell style={{ background: 'var(--rs-blue-700)', color: 'white' }}>Số lượng</HeaderCell>
                        <Cell dataKey="quantity" />
                      </Column>
                    </Table>

                    <List>
                      <List.Item
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          color: 'var(--rs-blue-700)',
                        }}
                      >
                        <span style={{ textAlign: 'center', padding: '0px 10px' }}>Tổng cộng:</span>
                        <span style={{ textAlign: 'center', padding: '0px 10px' }}>
                          <b>{formatCurrency(data.amount)}</b>
                        </span>
                      </List.Item>
                    </List>
                  </Panel>
                </div>
                <div className="col-12">
                  <Panel
                    header={
                      <h5>
                        Phương thức thanh toán :{' '}
                        <Tag color="blue" size="md" style={{ background: 'var(--rs-blue-700)' }}>
                          {data?.paymentType === 'transfer' ? 'Chuyển khoản ngân hàng' : ''}
                        </Tag>
                      </h5>
                    }
                    className="shadow  bg-white"
                  >
                    <Panel
                      header={
                        <>
                          <IconButton icon={<CharacterAuthorizeIcon />} />
                          {USER_SERVICE.name}
                        </>
                      }
                    >
                      <div className="row">
                        <div className="col-4">
                          <ButtonGroup block vertical>
                            {USER_SERVICE.value.map(({ bankName, bankCode }) => {
                              return (
                                <Button
                                  onClick={() =>
                                    (document.querySelector('#p').innerHTML = [bankName, bankCode].join(' : '))
                                  }
                                >
                                  {bankName}
                                </Button>
                              )
                            })}
                          </ButtonGroup>
                        </div>
                        <div className="col-8">
                          <Tag color="blue" id="p" size="lg" style={{ background: 'var(--rs-blue-700)' }}></Tag>
                        </div>
                      </div>
                    </Panel>
                  </Panel>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
      {/* <JsonViewer data={data} /> */}
    </div>
  )
}

export const getServerSideProps = async (ctx) => {
  const { slug } = ctx.query
  ctx.res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const resp = await axios.get('/order' + '/' + slug)

  const { data } = resp.data

  return {
    props: {
      data,
    },
  }
}
