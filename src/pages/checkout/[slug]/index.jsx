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

import CharacterAuthorizeIcon from '@rsuite/icons/CharacterAuthorize'
import MessageIcon from '@rsuite/icons/Message'
import PhoneIcon from '@rsuite/icons/Phone'
import clsx from 'clsx'
import CardBlock from 'component/UI/Content/CardBlock'
import { KMInput } from 'component/UI/Content/KMInput'
import PageHeader from 'component/UI/Content/PageHeader'
import axios from 'configs/axiosInstance'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { BiCheck } from 'react-icons/bi'
import { BsInboxes } from 'react-icons/bs'
import { Button, Form, IconButton, List, Radio, RadioGroup, Stack, Tag } from 'rsuite'
import { formatCurrency } from 'src/helper'
import styles from './styles.module.scss'

const USER_SERVICE = {
  name: 'Lê Thành Kha',
  value: [
    {
      bankName: 'Ngân Hàng Techcombank',
      bankCode: '0777999966',
      id: 1,
    },
    {
      bankName: 'Ngân Hàng ACB',
      bankCode: '1995 9968',
      id: 2,
    },
    {
      bankName: 'Ngân Hàng ACB',
      bankCode: '219069729',
      id: 3,
    },
    {
      bankName: 'Ngân Hàng VP Bank',
      bankCode: '777999966',
      id: 4,
    },
    {
      bankName: 'Ngân Hàng MB',
      bankCode: '1090160069999',
      id: 5,
    },
    {
      bankName: 'Ngân Hàng SCB',
      bankCode: '28601259966',
      id: 6,
    },
  ],
}

export default function OrderReceived({ data }) {
  const [tabsBank, setTabsBank] = useState(0)
  const router = useRouter()

  const renderPaymentContent = () => {
    let html = null

    switch (data?.paymentType) {
      case 'transfer':
        html = (
          <>
            <h5 className="text-secondary">Chuyển khoản ngân hàng</h5>

            <CardBlock className="border-0">
              <Stack>
                <IconButton icon={<CharacterAuthorizeIcon />} />
                {USER_SERVICE.name}
              </Stack>

              <div className="row py-2">
                <div className="col-12 col-sm-12 col-md-6 col-lg-4 d-flex flex-column p-2">
                  {USER_SERVICE.value.map(({ bankName, bankCode }, index) => {
                    return (
                      <Button
                        onClick={() => setTabsBank(index)}
                        className={clsx({
                          [styles.active]: tabsBank === index,
                        })}
                      >
                        {bankName}
                      </Button>
                    )
                  })}
                </div>

                <div className="col-12 col-sm-12 col-md-6  col-lg-8 p-2">
                  <Tag color="blue" id="p" size="lg" style={{ background: 'var(--rs-blue-700)' }}>
                    <span>
                      {USER_SERVICE.value[tabsBank].bankName} : {USER_SERVICE.value[tabsBank].bankCode}
                    </span>
                  </Tag>
                  <br />
                  <p>
                    <span> Nội dung chuyển khoản:</span>
                    <p>Thanh toan {data?.createDate}</p>
                  </p>
                  <Tag size="md">{data.userId?.fullName}</Tag>
                </div>
              </div>
            </CardBlock>
          </>
        )
        break

      case 'vnpay':
        html = (
          <div
            className={clsx('p-3 mb-2 rounded bg-gradient text-white border-radius', {
              'bg-success': data.status == 'completed',
              'bg-primary ': !data.status || data.status != 'completed',
            })}
          >
            <h5 className="text-light d-flex align-item-center">
              {data.status == 'completed' ? (
                <BiCheck style={{ fontSize: 36 }} />
              ) : (
                <div class="spinner-border text-light" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
              Thanh toán qua VN-PAY
            </h5>

            <p>{data.status && 'Đơn hàng đang được thanh toán thành công'}</p>
          </div>
        )
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
            <div className="col-12 col-md-12 col-lg-8">
              <div className="row gx-4 gy-4">
                <div className="col-12">{renderPaymentContent()}</div>
                <div className="col-12">
                  <h5 className="text-secondary">Thông tin đơn hàng</h5>

                  <CardBlock className="border-0">
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
                            <span style={{ textAlign: 'center', padding: '0px 10px' }}>
                              {item.productId?.title || item.variantId?.parentId?.title || ''}
                            </span>
                            {item.variantId && (
                              <span style={{ textAlign: 'center', padding: '0px 10px' }}>
                                {Object.keys(item.variantId?.attributes)
                                  .map((key) => item.variantId?.attributes[key])
                                  .join(' - ')}
                              </span>
                            )}

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
                  <h5 className="text-secondary"></h5>
                  <CardBlock className="border-0">
                    <p>Chúng tôi sẽ liên lạc lại với bạn sau ít phút</p>
                    <ul>
                      <ul className={styles.listLink}>
                        <h6>Mọi thắc mắc xin vui lòng liên hệ:</h6>
                        <li>
                          <IconButton icon={<MessageIcon />} appearance="subtle" />
                          <span className="text-dark">
                            220/9A, Đường Xô Viết Nghệ Tĩnh, Phường 21, Bình Thạnh, Hồ Chí Minh
                          </span>
                        </li>
                        <li>
                          <IconButton icon={<PhoneIcon />} appearance="subtle" />
                          <span>
                            <a href="tel:+0777999966" className="text-dark">
                              0777 9999 66
                            </a>
                          </span>
                        </li>
                        <li>
                          <IconButton icon={<MessageIcon />} appearance="subtle" />
                          <span>
                            <a href="mailto:kha44mobile@gmail.com" className="text-dark">
                              kha44mobile@gmail.com
                            </a>
                          </span>
                        </li>
                      </ul>
                    </ul>
                  </CardBlock>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-12 col-lg-4">
              <div className="row gy-4">
                <div className="col-12">
                  <h5 className="text-secondary">Thông tin cá nhân</h5>
                  <CardBlock className="border-0">
                    <KMInput name="fullName" label="Họ và tên" value={data?.['userInformation']?.['fullName']} />
                    <KMInput name="phone" label="Số điện thoại liên lạc" value={data?.['userInformation']?.['phone']} />
                    <KMInput name="email" label="Địa chỉ email" value={data?.['userInformation']?.['email']} />
                  </CardBlock>
                </div>

                <div className="col-12">
                  <h5 className="text-secondary">Địa chỉ giao hàng/ thanh toán</h5>

                  <CardBlock className="border-0">
                    <KMInput name="city" label="Thành phố" value={data?.['deliveryInformation']?.['city']} />
                    <KMInput name="district" label="Quận/Huyện" value={data?.['deliveryInformation']?.['district']} />
                    <KMInput name="wards" label="Phường/Xã" value={data?.['deliveryInformation']?.['wards']} />
                    <KMInput name="address" label="Địa chỉ" value={data?.['deliveryInformation']?.['address']} />
                  </CardBlock>
                </div>

                <div className="col-12">
                  <h5 className="text-secondary">Thông tin giao nhận</h5>

                  <CardBlock className="border-0">
                    <Form.Group controlId="radioList">
                      <RadioGroup name="radioList" value={data?.deliveryType} plaintext>
                        <Radio value="onStore">Nhận tại cửa hàng</Radio>
                        <Radio value="onAddress">Giao hàng tại nhà</Radio>
                      </RadioGroup>
                    </Form.Group>
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

  console.log(ctx.query)
  ctx.res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  try {
    const resp = await axios.get('/order' + '/' + slug)

    const { data } = resp.data
    // console.log(data)
    return {
      props: {
        data,
      },
    }
  } catch (error) {
    console.log(error)
    return {
      notFound: true,
    }
  }
}
