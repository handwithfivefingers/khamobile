import clsx from 'clsx'
import CardBlock from 'component/UI/Content/CardBlock'
import { KMInput, KMSelect } from 'component/UI/Content/KMInput'
import PageHeader from 'component/UI/Content/PageHeader'
import { useRouter } from 'next/router'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { Button, ButtonGroup, FlexboxGrid, Form, List, Radio, RadioGroup, Table, Tag } from 'rsuite'
import GlobalOrderService from 'service/global/Order.service'
import GlobalProductService from 'service/global/Product.service'
import ProvinceService from 'service/global/Province.service'
import { DeliveryModel, UserInformationModel } from 'src/constant/model.constant'
import { formatCurrency } from 'src/helper'
import { useAuthorizationStore } from 'src/store/authenticateStore'
import styles from './styles.module.scss'
const { HeaderCell, Cell, Column } = Table

export default function Checkout() {
  const router = useRouter()

  const { authenticate, user, changeAuthenticateStatus } = useAuthorizationStore((state) => state)

  const [price, setPrice] = useState(0)

  const [render, setRender] = useState(false)
  const deliveryRef = useRef()

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

  // useEffect(() => {
  //   if (authenticate && user) {
  //     deliveryRef.current = user.delivery
  //     informationRef.current = user
  //     formRef.current.deliveryInformation = user.delivery
  //     setRender(!render)
  //   }
  // }, [authenticate, user])

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

      if (!deliveryCheck()) return

      let { fullName, phone, email, _id } = informationRef.current

      const params = {
        ...restForm,
        userInformation: {
          fullName,
          phone,
          email,
        },
        userId: authenticate ? _id : null,
      }

      // return
      console.log(params)
      const resp = await GlobalOrderService.createOrder(params)

      if (resp.data.orderId) {
        localStorage.setItem('khaMobileCart', null)
        if (resp.data.urlPayment && restForm.paymentType === 'vnpay') window.open(resp.data.urlPayment)
        else router.push(`/checkout/${resp.data.orderId}`)
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
          <div className="col-12">
            <UserInformation ref={informationRef} data={informationRef.current} />
          </div>

          <div className="col-12">
            <DeliveryInformation ref={formRef} />
          </div>
        </>
      )
    }
    return html
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
            <div className="col-12 col-md-6 col-lg-6 col-xl-6">
              <div className="row gy-4">{renderUserInformationByCondition()}</div>
            </div>

            <div className="col-12 col-md-6 col-lg-6 col-xl-6">
              <div className="row gx-4 gy-4">
                <div className="col-12">
                  <h5 className="text-secondary">Thông tin giao nhận</h5>

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

                <div className="col-12">
                  <h5 className="text-secondary">Thông tin đơn hàng</h5>

                  <TableInformation product={formRef.current?.product} price={price} />
                </div>
                <div className="col-12">
                  <h5 className="text-secondary">Hình thức thanh toán</h5>
                  <CardBlock className="border-0">
                    <Form.Group controlId="radioList">
                      <RadioGroup
                        name="radioList"
                        onChange={(val) => (formRef.current = { ...formRef.current, paymentType: val })}
                        defaultValue={formRef.current?.paymentType}
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
      </div>
    </div>
  )
}

const UserInformation = forwardRef(({ data, ...props }, ref) => {
  const [state, setState] = useState(data)
  const userForm = useRef()
  useEffect(() => {
    setState(data)
  }, [data])

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
      <h5 className="text-secondary">Thông tin cá nhân</h5>
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
              onChange={(val) => console.log(val)}
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
      <h5 className="text-secondary">Địa chỉ giao hàng/ thanh toán</h5>

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
