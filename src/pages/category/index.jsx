import clsx from 'clsx'
import Heading from 'component/UI/Content/Heading'
import PageHeader from 'component/UI/Content/PageHeader'
import CommonLayout from 'component/UI/Layout'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Col, Row, Panel, Placeholder, Grid } from 'rsuite'
import GlobalCategoryService from 'service/global/Category.service'
import { useMessageStore } from 'src/store/messageStore'
import styles from './styles.module.scss'

const Card = (props) => (
  <Panel {...props} bordered header={props.title}>
    <Placeholder.Paragraph />
  </Panel>
)
export default function Category(props) {
  const [data, setData] = useState([])
  const router = useRouter()
  useEffect(() => {
    getCateData()
  }, [])

  const getCateData = async () => {
    try {
      let resp = await GlobalCategoryService.getProdCate()

      setData(resp.data.data)
    } catch (error) {
      console.log('error', error?.response?.data?.message)
    }
  }

  return (
    <div className="row p-0">
      <div className="col-12 p-0">
        <PageHeader type="h3" left divideClass={styles.divideLeft}>
          Danh mục
        </PageHeader>
      </div>
      <div className="col-12 p-0 py-2 border-top">
        <div className="container p-0">
          <Grid fluid>
            <Row>
              {data?.map((item, index) => {
                return (
                  <Col md={6} sm={12} style={{ margin: '6px 0' }} onClick={() => router.push(`/category/${item.slug}`)}>
                    <Card title={item.name} />
                  </Col>
                )
              })}
            </Row>
          </Grid>
        </div>
      </div>
    </div>
  )
}

Category.Layout = CommonLayout
