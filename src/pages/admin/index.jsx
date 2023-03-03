import AdminLayout from 'component/UI/AdminLayout'
import BarChart from 'component/UI/Chart/BarChart'
import LineChart from 'component/UI/Chart/LineChart'
import PolaArea from 'component/UI/Chart/PolaArea'
import Copyright from 'component/UI/Copyright'
import { useEffect, useState } from 'react'
import { Button, ButtonGroup, Col, Row } from 'rsuite'
import OrderService from 'service/admin/Order.service'

const Admin = () => {
  const [chartData, setChartData] = useState({})
  const [currentChart, setCurrentChart] = useState('bar')

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

  return (
    <>
      <Row className="dashboard-header p-3">
        <ButtonGroup>
          <Button active={currentChart === 'bar'} appearance="primary" onClick={() => setCurrentChart('bar')}>
            Bar
          </Button>
          <Button active={currentChart === 'line'} appearance="primary" onClick={() => setCurrentChart('line')}>
            Line
          </Button>
        </ButtonGroup>
      </Row>

      <Row className="p-2">
        <Col xs={16}>
          {chartData.monthData && currentChart === 'bar' ? (
            <BarChart data={chartData.monthData} />
          ) : currentChart === 'line' ? (
            <LineChart data={chartData.monthData} />
          ) : (
            ''
          )}
        </Col>

        <Col xs={8} className=" h-100">
          <PolaArea />
        </Col>
      </Row>

      <Row className="p-2">
        <Col xs={16}></Col>
        <Col xs={8}></Col>
      </Row>
      <Copyright />
    </>
  )
}

// Admin.Layout = CommonLayout;
Admin.Admin = AdminLayout
export default Admin
