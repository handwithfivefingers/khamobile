import { KMInput } from 'component/UI/Content/KMInput'
import { isEqual } from 'lodash'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Button, Col, Form, Grid, Row } from 'rsuite'

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

  return (
    <>
      <div className="container">
        <div className="d-flex">
          <Button
            onClick={() => {
              userInformationRef.current.toggleEdit()
              userDeliveryRef.current.toggleEdit()
            }}
          >
            Edit
          </Button>
        </div>
        <Grid fluid>
          <Row gutter={16}>
            <Col xs={12}>
              <UserInformation data={state.userInformation} ref={userInformationRef} />
            </Col>
            <Col xs={12}>
              <UserDelivery data={state.deliveryInformation} ref={userDeliveryRef} />
            </Col>
          </Row>
        </Grid>
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
      <KMInput className="w-100" name="fullName" label="Họ và tên" />
      <KMInput className="w-100" name="email" label="Địa chỉ email" />
      <KMInput className="w-100" name="phone" label="Số điện thoại" />
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
      <KMInput name="company" className="w-100" label="Công ty" />
      <KMInput name="address_1" className="w-100" label="Địa chỉ 1" />
      <KMInput name="address_2" className="w-100" label="Địa chỉ 2" value={state.address_2 || ' '} />
      <KMInput name="city" className="w-100" label="Tỉnh/Thành phố" />
      <KMInput name="postCode" className="w-100" label="Mã vùng" />
    </Form>
  )
})
