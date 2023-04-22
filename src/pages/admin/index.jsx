import { Paragraph } from '@rsuite/icons'
import AdminLayout from 'component/UI/AdminLayout'
import BarChart from 'component/UI/Chart/BarChart'
import LineChart from 'component/UI/Chart/LineChart'
import PolaArea from 'component/UI/Chart/PolaArea'
import CardBlock from 'component/UI/Content/CardBlock'
import Copyright from 'component/UI/Copyright'
import { useEffect, useMemo, useState } from 'react'
import { Button, ButtonGroup, Col, Panel, Placeholder, Row } from 'rsuite'
import OrderService from 'service/admin/Order.service'

const Admin = () => {
  const [chartData, setChartData] = useState({})

  useEffect(() => {
    getMonthChart()
  }, [])

  const getMonthChart = async () => {
    try {
      const resp = await OrderService.getOrderChart()
      setChartData((prev) => ({ ...prev, monthData: resp.data.data }))
    } catch (error) {
      console.log(error)
    }
  }

  const renderChart = useMemo(() => {
    return <BarChart data={chartData.monthData} />
  }, [chartData])

  return (
    <>
      <Row className="dashboard-header p-3">
        <Col xs={8}>
          <CardBlock className="border-0  w-100">
            <h5>Tổng số lượng sản phẩm</h5>
            <p>
              <Placeholder.Paragraph rows={2} />
            </p>
          </CardBlock>
        </Col>

        <Col xs={8}>
          <CardBlock className="border-0 w-100">
            <h5>Doanh thu</h5>
            <p>
              <Placeholder.Paragraph rows={2} />
            </p>
          </CardBlock>
        </Col>

        <Col xs={8}>
          <CardBlock className="border-0 w-100">
            <h5>Doanh thu</h5>
            <p>
              <Placeholder.Paragraph rows={2} />
            </p>
          </CardBlock>
        </Col>
      </Row>

      <Row className="p-2">
        <Col xs={16}>{renderChart}</Col>

        <Col xs={8} className=" h-100">
          <PolaArea />
        </Col>
      </Row>

      <Row className="p-2">
        <Col xs={16}>
          <CardBlock className="border-0 w-100">
            <Placeholder.Paragraph rows={6} />
          </CardBlock>
        </Col>
        <Col xs={8}>
          <CardBlock className="border-0 w-100">
            <Placeholder.Paragraph rows={6} />
          </CardBlock>
        </Col>
      </Row>
      <Copyright />
    </>
  )
}

Admin.Admin = AdminLayout
export default Admin
