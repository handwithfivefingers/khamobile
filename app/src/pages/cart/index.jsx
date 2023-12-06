// import CardBlock from 'component/UI/Content/CardBlock'
// import PageHeader from 'component/UI/Content/PageHeader'
import CommonLayout from 'component/UI/Layout'
import { NextSeo } from 'next-seo'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button, Form, InputGroup, InputNumber, List, Panel, Table } from 'rsuite'
import { GlobalProductService } from 'service/global'
import { formatCurrency } from 'src/helper'
import { useCartStore } from 'src/store'
import styles from './styles.module.scss'
import dynamic from 'next/dynamic'

const CardBlock = dynamic(() => import('component/UI/Content/CardBlock'))
const PageHeader = dynamic(() => import('component/UI/Content/PageHeader'))
const { HeaderCell, Cell, Column } = Table

export default function Cart(props) {
  const [data, setData] = useState([])

  const [price, setPrice] = useState({
    total: 0,
    subTotal: 0,
  })
  const { cart, addToCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    try {
      let cartItem = JSON.parse(localStorage.getItem('khaMobileCart'))
      let isValidData = cartItem?.some((attr) => !attr.quantity || !attr.price || !attr._id)
      if (!isValidData) handleGetListItemPrice(cartItem)
      else {
        if (!cartItem || cartItem !== null) {
          alert('Có lỗi xảy ra khi thêm vào giỏ hàng, vui lòng thử lại sau')
        }
        localStorage.setItem('khaMobileCart', null)
      }
    } catch (error) {
      console.log('get cart error', error)
    }
  }, [])

  useEffect(() => {
    if (data.length > 0) {
      handleCartItemChange()
    }
  }, [data])

  const handleCartItemChange = () => {
    try {
      let itemOnLocal = data?.map((item) => ({
        _id: item?._id,
        quantity: item?.quantity,
        price: item.price,
        variantId: item?.variantId,
      }))

      updatePrice()
      updateStore(itemOnLocal)
    } catch (error) {
      console.log('setCart error', error)
    }
  }

  const handleGetListItemPrice = async (item) => {
    try {
      setLoading(true)
      if (item?.length) {
        let groupItem = item?.map((item) => getScreenData(item?._id, item?.variantId, item?.quantity))
        if (groupItem?.length) {
          let resp = await Promise.all(groupItem)
          setData(resp)
        }
      }
    } catch (error) {
      console.log('handleGetListItemPrice', error)
    } finally {
      setLoading(false)
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

  const handleMinus = (row, key, rest) => {
    let nextState = [...data]

    if (nextState[rest.rowIndex].quantity <= 1) {
      nextState.splice(rest.rowIndex, 1)
    } else {
      nextState[rest.rowIndex].quantity = --nextState[rest.rowIndex].quantity
    }
    updateStore(nextState)
    setData(nextState)
  }

  const updateStore = (dataUpdate) => {
    addToCart(dataUpdate)
    localStorage.setItem('khaMobileCart', JSON.stringify(dataUpdate))
  }

  const updatePrice = () => {
    const totalPrice = data.reduce((prev, current) => {
      prev += +current?.price * +current?.quantity
      return prev
    }, 0)

    setPrice({
      total: totalPrice,
      subTotal: totalPrice,
    })
  }

  const handlePlus = (row, key, rest) => {
    let newData = [...data]
    newData[rest.rowIndex].quantity = ++newData[rest.rowIndex].quantity || 1
    setData(newData)
  }

  const QuantityCell = ({ rowData, dataKey, ...keyProps }) => (
    <Cell {...keyProps}>
      <InputGroup>
        <InputGroup.Button onClick={() => handleMinus(rowData, dataKey, { ...keyProps })}>-</InputGroup.Button>
        <InputNumber
          size="sm"
          className={styles.customInputNumber}
          value={rowData[dataKey]}
          onChange={(value) => handleChange(value, rowData, dataKey, { ...keyProps })}
        />
        <InputGroup.Button onClick={() => handlePlus(rowData, dataKey, { ...keyProps })}>+</InputGroup.Button>
      </InputGroup>
    </Cell>
  )

  const TotalCell = ({ rowData, dataKey, ...keyProps }) => (
    <Cell {...keyProps}>
      <InputNumber
        size="sm"
        className={styles.customInputNumber}
        value={formatCurrency(rowData['price'] * rowData['quantity'])}
        plaintext
      />
    </Cell>
  )

  const Pricing = ({ rowData, dataKey, ...keyProps }) => (
    <Cell {...keyProps}>
      <InputNumber size="sm" className={styles.customInputNumber} value={formatCurrency(rowData['price'])} plaintext />
    </Cell>
  )

  const handleChange = (val, rowData, dataKey, { ...keyProps }) => {
    let newData = [...data]
    newData[keyProps.rowIndex][dataKey] = val
    setData(newData)
  }

  return (
    <>
      <Head>
        <NextSeo
          title="Giỏ hàng - Khamobile"
          description="Kiểm tra sản phẩm trước khi tiến hành thanh toán"
          canonical={`${process.env.host}/cart`}
          openGraph={{
            type: 'website',
            locale: 'en_IE',
            url: `${process.env.host}/cart`,
            siteName: 'Giỏ hàng - Khamobile',
          }}
        />
      </Head>
      <div className="row p-0">
        <div className="col-12 p-0">
          <PageHeader type="h3" left divideClass={styles.divideLeft}>
            Giỏ hàng
          </PageHeader>
        </div>
        <div className="col-12 p-0 py-2 border-top">
          <div className="container">
            <div className="row gy-2">
              <div className="col-12 col-md-12 col-lg-8">
                <CardBlock>
                  <Panel bordered bodyFill>
                    <Form formValue={data}>
                      <Table height={400} data={data} rowHeight={58} loading={loading}>
                        <Column align="center" verticalAlign="middle" resizable flexGrow={1}>
                          <HeaderCell>Tên sản phẩm</HeaderCell>
                          <Cell dataKey="title" style={{ justifyContent: 'flex-start' }} />
                        </Column>

                        <Column align="center" verticalAlign="middle" resizable width={200}>
                          <HeaderCell>Đơn giá</HeaderCell>
                          <Pricing dataKey="price" />
                        </Column>

                        <Column width={120} verticalAlign="middle" align="center" resizable>
                          <HeaderCell>Số lượng</HeaderCell>
                          <QuantityCell dataKey="quantity" />
                        </Column>

                        <Column verticalAlign="middle" align="center" resizable width={200}>
                          <HeaderCell>Tạm tính</HeaderCell>
                          <TotalCell dataKey="total" />
                        </Column>
                      </Table>
                    </Form>
                  </Panel>
                </CardBlock>
              </div>
              <div className="col-12 col-md-12 col-lg-4">
                <CardBlock>
                  <Panel header="Tổng cộng" bordered>
                    {/* <Divider /> */}
                    <List>
                      <List.Item>
                        Tạm tính:
                        {formatCurrency(price.subTotal)}
                      </List.Item>
                      <List.Item>
                        Tổng cộng:
                        {formatCurrency(price.total)}
                      </List.Item>

                      <List.Item>
                        <Button
                          style={{ background: 'var(--rs-blue-800)', color: '#fff' }}
                          onClick={() => router.push('/checkout')}
                        >
                          Tiến hành Thanh toán
                        </Button>
                      </List.Item>
                    </List>
                  </Panel>
                </CardBlock>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

Cart.Layout = CommonLayout
