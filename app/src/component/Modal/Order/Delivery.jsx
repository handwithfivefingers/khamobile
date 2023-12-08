import ImageBlock from 'component/UI/Content/ImageBlock'
import { KMInput } from 'component/UI/Content/KMInput'
import isEqual from 'lodash/isEqual'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Form, List, Panel, PanelGroup, Table } from 'rsuite'
import { formatCurrency } from 'src/helper'

const { Column, HeaderCell, Cell } = Table
export default function DeliveryModal({ data, ...props }) {
  const [state, setState] = useState(data)
  const userInformationRef = useRef(null)
  const userDeliveryRef = useRef(null)
  useEffect(() => {
    const isEqualObject = isEqual(state, data)
    if (!isEqualObject) {
      setState(data)
    }
  }, [data])

  const { userInformation, deliveryInformation, ...rest } = state
  return (
    <>
      <div className="container">
        <PanelGroup>
          <Panel header="Thông tin liên lạc" collapsible defaultExpanded>
            <UserInformation data={userInformation} ref={userInformationRef} />
          </Panel>
          <Panel header="Địa chỉ giao hàng / Thánh toán" collapsible defaultExpanded>
            <UserDelivery data={deliveryInformation} ref={userDeliveryRef} />
          </Panel>
          <Panel header="Đơn hàng" collapsible defaultExpanded>
            <OrderInformation data={rest} ref={userDeliveryRef} />
          </Panel>
        </PanelGroup>
      </div>
    </>
  )
}

const UserInformation = forwardRef(({ data, ...props }, ref) => {
  const [state, setState] = useState(data)
  const [isEdit, setIsEdit] = useState(true)

  useEffect(() => {
    const isEqualObject = isEqual(state, data)

    if (!isEqualObject) {
      setState(data)
    }
  }, [data])

  useImperativeHandle(
    ref,
    () => {
      return {
        toggleEdit: () => setIsEdit(!isEdit),
      }
    },
    [isEdit],
  )

  return (
    <Form formValue={state} plaintext={isEdit} onChange={(val) => setState((prevState) => ({ ...prevState, ...val }))}>
      <div className="grid grid-cols-3">
        <div className="col-span-1">
          <div className="flex flex-col justify-center">
            <label className="text-[rgba(0,0,0,0.5)] text-[12px]">Họ và tên</label>
            <KMInput name="fullName" />
          </div>
        </div>
        <div className="col-span-1">
          <div className="flex flex-col justify-center">
            <label className="text-[rgba(0,0,0,0.5)] text-[12px]">Địa chỉ email</label>
            <KMInput name="email" />
          </div>
        </div>
        <div className="col-span-1">
          <div className="flex flex-col justify-center">
            <label className="text-[rgba(0,0,0,0.5)] text-[12px]">Số điện thoại</label>
            <KMInput name="phone" />
          </div>
        </div>
      </div>
    </Form>
  )
})

const UserDelivery = forwardRef(({ data, ...props }, ref) => {
  const [state, setState] = useState(data)
  const [isEdit, setIsEdit] = useState(true)

  useEffect(() => {
    const isEqualObject = isEqual(state, data)

    if (!isEqualObject) {
      setState(data)
    }
  }, [data])

  useImperativeHandle(
    ref,
    () => {
      return {
        toggleEdit: () => setIsEdit(!isEdit),
      }
    },
    [isEdit],
  )

  return (
    <Form formValue={state} plaintext={isEdit} onChange={(val) => setState((prevState) => ({ ...prevState, ...val }))}>
      <div className="grid grid-cols-4">
        <div className="col-span-1">
          <div className="flex flex-col justify-center">
            <label className="text-[rgba(0,0,0,0.5)] text-[12px]">Địa chỉ</label>
            <KMInput name="address" />
          </div>
        </div>
        <div className="col-span-1">
          <div className="flex flex-col justify-center">
            <label className="text-[rgba(0,0,0,0.5)] text-[12px]">Phường/Xã</label>
            <KMInput name="wards" />
          </div>
        </div>
        <div className="col-span-1">
          <div className="flex flex-col justify-center">
            <label className="text-[rgba(0,0,0,0.5)] text-[12px]">Quận/Huyện</label>
            <KMInput name="district" />
          </div>
        </div>
        <div className="col-span-1">
          <div className="flex flex-col justify-center">
            <label className="text-[rgba(0,0,0,0.5)] text-[12px]">Tỉnh/Thành Phố</label>
            <KMInput name="city" />
          </div>
        </div>
      </div>
    </Form>
  )
})

const OrderInformation = forwardRef(({ data, ...props }, ref) => {
  const [state, setState] = useState(data)
  const [isEdit, setIsEdit] = useState(true)
  useEffect(() => {
    const isEqualObject = isEqual(state, data)

    if (!isEqualObject) {
      setState(data)
    }
  }, [data])
  useImperativeHandle(
    ref,
    () => {
      return {
        toggleEdit: () => setIsEdit(!isEdit),
      }
    },
    [isEdit],
  )
  return (
    <Form formValue={state} plaintext={isEdit} onChange={(val) => setState((prevState) => ({ ...prevState, ...val }))}>
      <Table data={data?.product} rowHeight={100}>
        <Column width={80}>
          <HeaderCell>Hình ảnh</HeaderCell>
          <Cell>{(rowData) => <ImageBlock src={rowData.image.src} engine objectFit="contain" />}</Cell>
        </Column>
        <Column fullText flexGrow={1}>
          <HeaderCell>Sản phẩm</HeaderCell>
          <Cell>{(rowData) => <span>{rowData._id.title}</span>}</Cell>
        </Column>
        <Column>
          <HeaderCell>Số lượng</HeaderCell>
          <Cell>{(rowData) => <span>{rowData.quantity}</span>}</Cell>
        </Column>
        <Column>
          <HeaderCell>Thuộc tính</HeaderCell>
          <Cell>{(rowData) => <span>{rowData.quantity}</span>}</Cell>
        </Column>
        <Column width={150}>
          <HeaderCell>⭐️ Giá tiền</HeaderCell>
          <Cell>
            {(rowData) => (
              <span>
                {formatCurrency((rowData.variantId?.price || rowData._id.price) * rowData.quantity, { symbol: 'đ' })}
              </span>
            )}
          </Cell>
        </Column>
      </Table>

      <List>
        <List.Item>
          Tổng giá tiền : <span>{formatCurrency(data.amount, { symbol: 'đ' })}</span>
          <br />
          <i className="text-muted fs-6 fw-light">Giá trị đơn hàng tại thời điểm mua hàng</i>
        </List.Item>
      </List>
    </Form>
  )
})
