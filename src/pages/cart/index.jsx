import FilmIcon from '@rsuite/icons/legacy/Film'
import ImageIcon from '@rsuite/icons/legacy/Image'
import UserCircleIcon from '@rsuite/icons/legacy/UserCircleO'
import CardBlock from 'component/UI/Content/CardBlock'
import Divider from 'component/UI/Content/Divider'
import Heading from 'component/UI/Content/Heading'
import PageHeader from 'component/UI/Content/PageHeader'
import CommonLayout from 'component/UI/Layout'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FlexboxGrid, List, Panel, InputGroup, InputNumber, Table, Button, Form } from 'rsuite'
import GlobalProductService from 'service/global/Product.service'
import { formatCurrency } from 'src/helper'
import styles from './styles.module.scss'
const { HeaderCell, Cell, Column } = Table

const EditableCell = ({ rowData, dataKey, onChange, ...props }) => {
  const editing = rowData.status === 'EDIT'
  return (
    <Cell {...props} className={editing ? 'table-content-editing' : ''}>
      {editing ? (
        <input
          className="rs-input"
          defaultValue={rowData[dataKey]}
          onChange={(event) => {
            onChange && onChange(rowData.id, dataKey, event.target.value)
          }}
        />
      ) : (
        <span className="table-content-edit-span">{rowData[dataKey]}</span>
      )}
    </Cell>
  )
}

export default function Cart(props) {
  const [data, setData] = useState([])

  const [price, setPrice] = useState({
    total: 0,
    subTotal: 0,
  })

  const router = useRouter()

  useEffect(() => {
    let item = JSON.parse(localStorage.getItem('khaMobileCart'))
    if (item) {
      handleGetListItemPrice(item)
    }
  }, [])
  useEffect(() => {
    const totalPrice = data.reduce((prev, current) => {
      prev += +current.price * +current.quantity
      return prev
    }, 0)

    setPrice({
      total: totalPrice,
      subTotal: totalPrice,
    })

    let itemOnLocal = data.map(({ _id, quantity, price }) => ({ sku: _id, quantity, skuPrice: price }))

    localStorage.setItem('khaMobileCart', JSON.stringify(itemOnLocal))
  }, [data])

  const handleGetListItemPrice = async (item) => {
    try {
      let groupItem = item.map(({ sku, quantity }) => getScreenData(sku, quantity))
      let resp = await Promise.all(groupItem)
      setData(resp)
    } catch (error) {
      console.log('handleGetListItemPrice', error)
    }
  }

  const getScreenData = async (_id, quantity) => {
    try {
      let resp = await GlobalProductService.getProductById(_id)
      return { ...resp.data.data, quantity }
    } catch (error) {
      console.log('getScreenData ', error)
    }
  }

  const handleMinus = (row, key, rest) => {
    let newData = [...data]
    newData[rest.rowIndex].quantity = --newData[rest.rowIndex].quantity || 1
    setData(newData)
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
        value={
          rowData['skuPrice']
            ? formatCurrency(rowData['skuPrice'] * rowData['quantity'])
            : formatCurrency(rowData['price'] * rowData['quantity'])
        }
        plaintext
      />
    </Cell>
  )
  const Pricing = ({ rowData, dataKey, ...keyProps }) => (
    <Cell {...keyProps}>
      <InputNumber
        size="sm"
        className={styles.customInputNumber}
        value={
          rowData['skuPrice']
            ? formatCurrency(rowData['skuPrice'] * rowData['quantity'])
            : formatCurrency(rowData['price'] * rowData['quantity'])
        }
        plaintext
      />
    </Cell>
  )
  const handleChange = (val, rowData, dataKey, { ...keyProps }) => {
    let newData = [...data]
    newData[keyProps.rowIndex][dataKey] = val
    setData(newData)
  }
  return (
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
                    <Table height={400} data={data} rowHeight={58}>
                      <Column align="center" verticalAlign="middle" resizable flexGrow={1}>
                        <HeaderCell>Tên sản phẩm</HeaderCell>
                        <Cell dataKey="title" />
                      </Column>

                      <Column align="center" verticalAlign="middle" resizable width={200}>
                        <HeaderCell>Đơn giá</HeaderCell>
                        <Pricing dataKey="sku" />
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
  )
}

Cart.Layout = CommonLayout
