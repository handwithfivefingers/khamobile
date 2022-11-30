import PageHeader from 'component/UI/Content/PageHeader'
import React from 'react'
import { Form, Panel, Placeholder, Radio, RadioGroup } from 'rsuite'

export default function Checkout() {
  return (
    <div className="row p-0">
      <div className="col-12 p-0">
        <PageHeader type="h3" left>
          Thanh toán
        </PageHeader>
      </div>
      <div className="col-12 p-0 py-2 border-top">
        <div className="container">
          <Form className="row gx-4">
            <div className="col-4 ">
              <div className="row gy-4">
                <div className="col-12">
                  <Panel header={<h5>Thông tin cá nhân</h5>} bordered>
                    {/* <Placeholder.Paragraph rows={15} /> */}
                    <Form.Group controlId="firstName">
                      <Form.ControlLabel>First Name</Form.ControlLabel>
                      <Form.Control name="firstName" />
                    </Form.Group>
                    <Form.Group controlId="lastName">
                      <Form.ControlLabel>Last Name</Form.ControlLabel>
                      <Form.Control name="lastName" />
                    </Form.Group>
                    <Form.Group controlId="email">
                      <Form.ControlLabel>E-Mail</Form.ControlLabel>
                      <Form.Control name="email" />
                    </Form.Group>
                    <Form.Group controlId="phone">
                      <Form.ControlLabel>Telephone</Form.ControlLabel>
                      <Form.Control name="phone" />
                    </Form.Group>
                  </Panel>
                </div>
                <div className="col-12">
                  <Panel bordered header={<h5>Địa chỉ giao hàng/ thanh toán</h5>}>
                    {/* <Placeholder.Paragraph rows={15} /> */}
                    <Form.Group controlId="company">
                      <Form.ControlLabel>Company</Form.ControlLabel>
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
                      <Form.ControlLabel>Post Code</Form.ControlLabel>
                      <Form.Control name="postCode" />
                    </Form.Group>
                  </Panel>
                </div>
              </div>
            </div>
            <div className="col-8  ">
              <div className="row gx-4 gy-4">
                <div className="col-12">
                  <Panel header={<h5>Phương thức vận chuyển</h5>} className="shadow  bg-white">
                    <Placeholder.Paragraph rows={4} />
                  </Panel>
                </div>
                <div className="col-12">
                  <Panel header={<h5>Phương thức thanh toán</h5>} className="shadow  bg-white">
                    <Placeholder.Paragraph rows={6} />
                  </Panel>
                </div>
                <div className="col-12">
                  <Panel header={<h5>Thông tin đơn hàng</h5>} className="shadow  bg-white">
                    <Placeholder.Paragraph rows={12} />
                  </Panel>
                </div>
                <div className="col-12">
                  <Panel header={<h5>Hình thức thanh toán</h5>} className="shadow  bg-white">
                    <Form.Group controlId="radioList">
                      <RadioGroup name="radioList">
                        <Radio value="A">Chuyển khoản</Radio>

                        <Radio value="B">Qua Vn-Pay</Radio>
                      </RadioGroup>
                    </Form.Group>
                  </Panel>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}
