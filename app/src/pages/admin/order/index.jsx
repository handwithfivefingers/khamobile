import DeliveryModal from 'component/Modal/Order/Delivery'
import AdminLayout from 'component/UI/AdminLayout'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Button, Content, Modal, SelectPicker, Stack, Table, Tag, Input } from 'rsuite'
import OrderService from 'service/admin/Order.service'
import { useCommonStore } from 'src/store/commonStore'

const { Column, HeaderCell, Cell } = Table

const Orders = () => {
  const changeTitle = useCommonStore((state) => state.changeTitle)
  const [data, setData] = useState([])
  const [dataFilter, setDataFilter] = useState([])
  const [filter, setFilter] = useState({
    fullName: '',
  })
  const [modal, setModal] = useState({
    visible: false,
    component: null,
  })

  useEffect(() => {
    changeTitle('Page Orders')
    getOrder()
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      let nextData = []
      if (filter.fullName) {
        nextData = data.filter((item) =>
          item.userInformation.fullName.toLowerCase()?.includes(filter.fullName.toLowerCase()),
        )
      } else {
        nextData = data
      }
      setDataFilter(nextData)
    }, 500)
    return () => clearTimeout(timeout)
  }, [filter.fullName, data])

  const getOrder = async () => {
    try {
      const resp = await OrderService.getOrders()
      const { data } = resp.data
      setData(data)
      setDataFilter(data)
    } catch (error) {
      console.log('getOrders error: ' + error)
    }
  }

  const handleOpenModalDelivery = (rowData) => {
    setModal({ ...modal, visible: true, component: <DeliveryModal data={rowData} /> })
  }

  return (
    <>
      <Stack spacing={10} className="py-2">
        <span>Tìm kiếm: </span>
        <Input placeholder="Tên người dùng" onChange={(v) => setFilter((state) => ({ ...state, fullName: v }))} />
      </Stack>
      <Content className={'bg-w'}>
        <Table
          // height={400}
          height={60 * (10 + 1)}
          rowHeight={60}
          data={dataFilter}
          // onRowClick={(rowData) => {
          //   console.log(rowData)
          // }}
        >
          <Column width={60} align="center" fixed>
            <HeaderCell>Id</HeaderCell>
            <Cell dataKey="_id" />
          </Column>

          <Column width={150}>
            <HeaderCell>Tên</HeaderCell>
            <Cell dataKey="userInformation.fullName" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Số điện thoại</HeaderCell>
            <Cell dataKey="userInformation.phone" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Email</HeaderCell>
            <Cell dataKey="userInformation.email" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Ngày tạo</HeaderCell>
            <Cell dataKey="createdAt">
              {(rowData) => <span>{moment(rowData.createdAt).format('DD/MM/YYYY HH:mm')}</span>}
            </Cell>
          </Column>
          <Column width={150}>
            <HeaderCell>Phương thức thanh toán</HeaderCell>
            <Cell dataKey="paymentType">
              {(rowData) => (
                <span>
                  <Tag>{rowData.paymentType === 'vnpay' ? 'VN-Pay' : 'Chuyển khoản'}</Tag>
                </span>
              )}
            </Cell>
          </Column>

          <Column width={150}>
            <HeaderCell>Trạng thái thanh toán</HeaderCell>
            <Cell dataKey="status">
              {(rowData) => (
                <span>
                  <Tag color={rowData.status === 'pending' ? 'orange' : rowData.status === 'failed' ? 'red' : 'green'}>
                    {rowData.status}
                  </Tag>
                </span>
              )}
            </Cell>
          </Column>

          <Column width={80} fixed="right">
            <HeaderCell>...</HeaderCell>

            <Cell>
              {(rowData) => (
                <span>
                  <Button onClick={() => handleOpenModalDelivery(rowData)}>Edit</Button>
                </span>
              )}
            </Cell>
          </Column>
        </Table>
      </Content>
      <Modal
        open={modal.visible}
        onClose={() => setModal({ ...modal, visible: false })}
        size="lg"
        className="animate__animated animate__fadeInUp"
      >
        <Modal.Header>
          <Modal.Title>Thông tin giao hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modal.component}</Modal.Body>
      </Modal>
    </>
  )
}
Orders.Admin = AdminLayout

export default Orders
