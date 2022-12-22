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
import CardBlock from 'component/UI/Content/CardBlock'
import { KMInput } from 'component/UI/Content/KMInput'
import { BsInboxes } from 'react-icons/bs'

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

  const [tabsBank, setTabsBank] = useState([])

  const renderPaymentContent = () => {
    let html = null

    switch (data?.paymentType) {
      case 'transfer':
        html = (
          <>
            <Stack>
              <IconButton icon={<CharacterAuthorizeIcon />} />
              {USER_SERVICE.name}
            </Stack>

            <div className="row">
              <div className="col-4">
                <ButtonGroup block vertical>
                  {USER_SERVICE.value.map(({ bankName, bankCode }) => {
                    return <Button onClick={() => setTabsBank([bankName, bankCode])}>{bankName}</Button>
                  })}
                </ButtonGroup>
              </div>
              <div className="col-8">
                <Tag color="blue" id="p" size="lg" style={{ background: 'var(--rs-blue-700)' }}>
                  <span>{tabsBank.join(' : ')}</span>
                </Tag>
                <br />
                Nội dung chuyển khoản: <br />
                <Tag size="md">{data.userId?.fullName}</Tag>
              </div>
            </div>
          </>
        )
        break

      case 'vnpay':
        html = <></>
    }

    return html
  }
  console.log(data)
  if (!data)
    return (
      <div className="d-flex justify-content-center flex-column align-items-center">
        <BsInboxes style={{ fontSize: 36, color: 'var(--rs-blue-800)' }} />
        <p className="text-secondary">Không có sản phẩm phù hợp với tiêu chí bạn tìm</p>
      </div>
    )
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
                  <CardBlock className="border-0">
                    <h5>Thông tin cá nhân</h5>
                    <KMInput name="fullName" label="Họ và tên" value={data?.['userInformation']?.['fullName']} />
                    <KMInput name="phone" label="Số điện thoại liên lạc" value={data?.['userInformation']?.['phone']} />
                    <KMInput name="email" label="Địa chỉ email" value={data?.['userInformation']?.['email']} />
                  </CardBlock>
                </div>

                <div className="col-12">
                  <CardBlock className="border-0">
                    <h5>Địa chỉ giao hàng/ thanh toán</h5>
                    <KMInput name="company" label="Công ty" value={data?.['deliveryInformation']?.['company']} />
                    <KMInput name="address_1" label="Địa chỉ 1" value={data?.['deliveryInformation']?.['address_1']} />
                    <KMInput name="address_2" label="Địa chỉ 2" value={data?.['deliveryInformation']?.['address_2']} />
                    <KMInput name="city" label="Tỉnh/ Thành phố" value={data?.['deliveryInformation']?.['city']} />
                    <KMInput name="postCode" label="Mã vùng" value={data?.['deliveryInformation']?.['postCode']} />
                  </CardBlock>
                </div>

                <div className="col-12">
                  <CardBlock className="border-0">
                    <h5>Phương thức vận chuyển</h5>
                    <Form.Group controlId="radioList">
                      <RadioGroup
                        name="radioList"
                        onChange={(val) => setForm({ ...form, deliveryType: val })}
                        value={data?.deliveryType}
                      >
                        <Radio value="cod">COD</Radio>
                      </RadioGroup>
                    </Form.Group>
                  </CardBlock>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-8">
              <div className="row gx-4 gy-4">
                <div className="col-12">
                  <CardBlock className="border-0">
                    <h5>Thông tin đơn hàng</h5>
                    <List>
                      {data?.product?.map((item) => {
                        return (
                          <List.Item
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              color: 'var(--rs-blue-700)',
                            }}
                          >
                            <span style={{ textAlign: 'center', padding: '0px 10px' }}>{item.productId?.title}</span>
                            <span style={{ textAlign: 'center', padding: '0px 10px' }}>
                              <b>{formatCurrency(item.variantId?.price || item.productId?.price)}</b>
                            </span>
                          </List.Item>
                        )
                      })}

                      <List.Item
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          color: 'var(--rs-blue-700)',
                        }}
                      >
                        <span style={{ textAlign: 'center', padding: '0px 10px' }}>Tổng cộng:</span>
                        <span style={{ textAlign: 'center', padding: '0px 10px' }}>
                          <b>{formatCurrency(data?.amount)}</b>
                        </span>
                      </List.Item>
                    </List>
                  </CardBlock>
                </div>
                <div className="col-12">
                  <CardBlock className="border-0">
                    <h5>
                      Phương thức thanh toán :{' '}
                      <Tag color="blue" size="md" style={{ background: 'var(--rs-blue-700)' }}>
                        {data?.paymentType === 'transfer'
                          ? 'Chuyển khoản ngân hàng'
                          : data?.paymentType === 'vnpay'
                          ? 'Cổng thanh toán Vn-Pay'
                          : ''}
                      </Tag>
                    </h5>
                    {renderPaymentContent()}
                  </CardBlock>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async (ctx) => {
  const { slug } = ctx.query
  ctx.res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const resp = await axios.get('/order' + '/' + slug)

  const { data } = resp.data
  console.log(data)
  return {
    props: {
      data,
    },
  }
}
