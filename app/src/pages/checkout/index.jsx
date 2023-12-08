import clsx from 'clsx'
import CardBlock from 'component/UI/Content/CardBlock'
import { KMInput, KMSelect } from 'component/UI/Content/KMInput'
import NoData from 'component/UI/Content/NoData'
import PageHeader from 'component/UI/Content/PageHeader'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { Button, ButtonGroup, FlexboxGrid, Form, List, Radio, RadioGroup, Table, Tag } from 'rsuite'
import { GlobalOrderService, GlobalProductService, ProvinceService } from 'service/global'
import { DeliveryModel, UserInformationModel } from 'src/constant/model.constant'
import { formatCurrency } from 'src/helper'
import { useAuthorizationStore, useCartStore } from 'src/store'
import styles from './styles.module.scss'
const { HeaderCell, Cell, Column } = Table

export default function Checkout() {
  const router = useRouter()

  const { authenticate } = useAuthorizationStore((state) => state)
  const { cart } = useCartStore((state) => state)

  const [price, setPrice] = useState(0)

  const informationRef = useRef()

  const formRef = useRef({
    deliveryType: 'onStore',
    paymentType: 'transfer',
    deliveryInformation: {},
  })

  useEffect(() => {
    let item = JSON.parse(localStorage.getItem('khaMobileCart'))
    if (item) {
      handleGetListItemPrice(item)
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

      formRef.current = {
        ...formRef.current,
        amount: totalPrice,
        product: resp,
      }

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
      let { deliveryCheck, ...restForm } = formRef.current
      let { userInformationCheck, fullName, phone, email, _id } = informationRef.current

      if (!userInformationCheck() || !deliveryCheck()) return

      const params = {
        ...restForm,
        userInformation: {
          fullName,
          phone,
          email,
        },
        userId: authenticate ? _id : null,
      }

      const resp = await GlobalOrderService.createOrder(params)

      if (resp.data.orderId) {
        localStorage.setItem('khaMobileCart', null)
        if (resp.data.urlPayment && restForm.paymentType === 'vnpay') window.open(resp.data.urlPayment)
        router.push(`/checkout/${resp.data.orderId}`)
      }
    } catch (error) {
      console.log('handleSaveOrder', error)
    }
  }

  const renderUserInformationByCondition = (condition) => {
    let html = null

    if (condition) {
      html = <DeliveryInformation ref={formRef} />
    } else {
      html = (
        <>
          <div className="col-span-12">
            <UserInformation ref={informationRef} data={informationRef.current} />
          </div>

          <div className="col-span-12">
            <DeliveryInformation ref={formRef} />
          </div>
        </>
      )
    }
    return html
  }

  return (
    <>
      <NextSeo
        title="Thanh toán - Kha Mobile - Giá rẻ mỗi ngày"
        description="Thanh toán - Kha Mobile - Giá rẻ mỗi ngày"
      />
      <div className="grid grid-cols-12 p-0">
        <div className="col-span-12 px-4">
          <PageHeader type="h3" left>
            Thanh toán
          </PageHeader>
        </div>
        <div className="col-span-12 px-4 py-2 border-t">
          {(!cart?.length && <NoData description={'Sản phẩm không tồn tại, vui lòng thử lại'} />) || ''}

          {(cart.length && (
            <div className="container mx-auto">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-6">
                  <div className="grid grid-cols-12 gap-4">{renderUserInformationByCondition()}</div>
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-6">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12">
                      <h5 className="text-[rgba(0,0,0,50%) font-normal">Thông tin giao nhận</h5>

                      <CardBlock className="border-0">
                        <Form.Group controlId="radioList">
                          <RadioGroup
                            name="radioList"
                            onChange={(val) => (formRef.current = { ...formRef.current, deliveryType: val })}
                            defaultValue={formRef.current?.deliveryType}
                          >
                            <Radio value="onStore">Nhận tại cửa hàng</Radio>
                            <Radio value="onAddress">Giao hàng tại nhà</Radio>
                          </RadioGroup>
                        </Form.Group>
                      </CardBlock>
                    </div>

                    <div className="col-span-12">
                      <h5 className="text-[rgba(0,0,0,50%) font-normal">Thông tin đơn hàng</h5>

                      <TableInformation product={formRef.current?.product} price={price} />
                    </div>
                    <div className="col-span-12">
                      <h5 className="text-[rgba(0,0,0,50%)] font-normal">Hình thức thanh toán</h5>
                      <CardBlock className="border-0">
                        <Form.Group controlId="radioList">
                          <RadioGroup
                            name="radioList"
                            onChange={(val) => (formRef.current = { ...formRef.current, paymentType: val })}
                            defaultValue={formRef.current?.paymentType}
                          >
                            <Radio value="transfer">Chuyển khoản</Radio>
                            <Radio value="vnpay" disabled>
                              Qua Vn-Pay
                            </Radio>
                          </RadioGroup>
                        </Form.Group>
                      </CardBlock>
                    </div>

                    <div className="col-span-12">
                      <div className={styles.action}>
                        <ButtonGroup>
                          <Button
                            color="red"
                            appearance="primary"
                            className={clsx(styles.btnIcon, 'bg-primary text-white')}
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
          )) ||
            ''}
        </div>
      </div>
    </>
  )
}

const UserInformation = forwardRef(({ data, ...props }, ref) => {
  const [state, setState] = useState(data)
  const userForm = useRef()
  useEffect(() => {
    setState(data)
  }, [data])

  ref.current = {
    ...ref.current,
    userInformationCheck: () => userForm.current.check(),
  }
  return (
    <Form
      formValue={state}
      onChange={(val) => {
        setState(val)
        ref.current = { ...val, validate: () => userForm.current.check() }
      }}
      ref={userForm}
      model={UserInformationModel}
    >
      <h5 className="text-[rgba(0,0,0,50%) font-normal">Thông tin cá nhân</h5>
      <CardBlock className="border-0">
        <FlexboxGrid style={{ gap: 12, flexDirection: 'column' }}>
          <FlexboxGrid.Item style={{ width: '100%' }} className="w-100">
            <KMInput
              name="fullName"
              label={
                <>
                  Họ và tên <span className="t-secondary">*</span>
                </>
              }
            />
          </FlexboxGrid.Item>

          <FlexboxGrid.Item style={{ width: '100%' }} className="w-100">
            <KMInput
              name="email"
              label={
                <>
                  Email <span className="t-secondary">*</span>
                </>
              }
            />
          </FlexboxGrid.Item>

          <FlexboxGrid.Item style={{ width: '100%' }} className="w-100">
            <KMInput
              name="phone"
              label={
                <>
                  Số điện thoại <span className="t-secondary">*</span>
                </>
              }
              placeholder="0123456789"
              guide={false}
              keepCharPositions={true}
            />
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </CardBlock>
    </Form>
  )
})

const DeliveryInformation = forwardRef(({ data, ...props }, ref) => {
  const [state, setState] = useState(data)

  const deliveryForm = useRef()

  useEffect(() => {
    setState(data)
  }, [data])

  ref.current = {
    ...ref.current,
    deliveryCheck: () => deliveryForm.current.check(),
  }

  return (
    <Form key={['delivery']} formValue={state} ref={deliveryForm} model={DeliveryModel}>
      <h5 className="text-[rgba(0,0,0,50%) font-normal">Địa chỉ giao hàng/ thanh toán</h5>

      <CardBlock className="border-0">
        <FlexboxGrid.Item style={{ width: '100%' }} className="w-100">
          <SelectProvinceInput
            ref={ref}
            onChange={(v) => (ref.current.deliveryInformation = { ...ref.current.deliveryInformation, ...v })}
          />
        </FlexboxGrid.Item>

        <FlexboxGrid.Item style={{ width: '100%' }} className="w-100 mt-3">
          <KMInput
            name="address"
            label={
              <>
                Địa chỉ giao hàng<span className="t-secondary">*</span>
              </>
            }
            type="textarea"
            rows={3}
            style={{ width: '100%' }}
            onChange={(value) => (ref.current.deliveryInformation.address = value)}
          />
        </FlexboxGrid.Item>
      </CardBlock>
    </Form>
  )
})

const SelectProvinceInput = forwardRef((props, ref) => {
  const [city, setCity] = useState([])

  const [district, setDistrict] = useState([])

  const [wards, setWards] = useState([])

  const [params, setParams] = useState({
    code: '',
    wards: '',
  })

  const [select, setSelect] = useState()

  useEffect(() => {
    getCity()
  }, [])

  useEffect(() => {
    getScreenData(params)
  }, [params])

  useEffect(() => {
    props.onChange(select)
  }, [select])

  const getCity = async (params) => {
    const resp = await ProvinceService.getCity()
    let { data } = resp.data
    setCity(data)
  }

  const getScreenData = async ({ code = null, wards = null } = {}) => {
    try {
      if (!code) return

      let res = await ProvinceService.getCity({ code, wards })

      let { data } = res.data
      if (res) {
        if (code) {
          if (wards) {
            return setWards(data)
          }
          return setDistrict(data)
        }
      }
    } catch (err) {
      console.log('getScreenData err: ' + err)
    }
  }

  const handleSelectCity = async (value) => {
    let item = city?.find((item) => item?.name === value)

    wards?.length && setWards([])

    district?.length && setDistrict([])

    setSelect({ city: value, district: null, wards: null })

    setParams({ wards: null, code: item?.code })
  }

  const handleSelectDistrict = async (value) => {
    let item = district?.find((item) => item?.name === value)

    setSelect((prev) => ({ ...prev, district: value }))

    setParams((prev) => ({ ...prev, wards: item?.code }))
  }

  return (
    <>
      <KMSelect
        name="city"
        data={city}
        valueKey="name"
        labelKey="name"
        label={
          <>
            Tỉnh / Thành phố<span className="t-secondary">*</span>
          </>
        }
        onChange={handleSelectCity}
        style={{ width: '100%' }}
        value={select?.city}
      />

      <KMSelect
        name="district"
        data={district}
        label={
          <>
            Quận / Huyện<span className="t-secondary">*</span>
          </>
        }
        valueKey="name"
        labelKey="name"
        onChange={handleSelectDistrict}
        style={{ width: '100%' }}
        value={select?.district}
      />

      <KMSelect
        name="wards"
        data={wards}
        valueKey="name"
        labelKey="name"
        label={
          <>
            Phường / Trấn / Thị xã <span className="t-secondary">*</span>
          </>
        }
        onChange={(value) => setSelect((prev) => ({ ...prev, wards: value }))}
        style={{ width: '100%' }}
        value={select?.wards}
      />
    </>
  )
})

const TableInformation = ({ product, price }) => {
  return (
    <CardBlock className="border-0">
      <Table autoHeight data={product}>
        <Column align="left" fullText flexGrow={1}>
          <HeaderCell style={{ background: 'var(--rs-blue-800)', color: 'white' }}>Tên sản phẩm</HeaderCell>
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
  )
}
