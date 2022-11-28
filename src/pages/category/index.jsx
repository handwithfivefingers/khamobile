import clsx from 'clsx'
import Heading from 'component/UI/Content/Heading'
import CommonLayout from 'component/UI/Layout'
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

  console.log('data', data)

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <Heading type="h3" left divideClass={styles.divideLeft}>
            Danh mục
          </Heading>
        </div>

        {/* <div className={styles.categories}>
          <div className={styles.listCate}>
            {data?.map((item, index) => {
              return (
                <div
                  className={clsx(styles.cateItem)}
                  style={{
                    backgroundImage: `url(https://cdn2.cellphones.com.vn/180x/https://cdn2.cellphones.com.vn/x/media/catalog/product/a/p/apple_care_1.png)`,
                  }}
                >
                  {item.name}
                </div>
              )
            })}
          </div>
        </div> */}
      </div>
      <Grid fluid>
        <Row gutter={12}>
          {data?.map((item, index) => {
            return (
              <Col md={6} sm={12} style={{margin:'6px 0'}}>
                <Card title={item.name} />
              </Col>

              // <div
              //   className={clsx('col-3 card')}
              //   style={{
              //     backgroundImage: `url(https://cdn2.cellphones.com.vn/180x/https://cdn2.cellphones.com.vn/x/media/catalog/product/a/p/apple_care_1.png)`,
              //   }}
              // >
              //   {item.name}
              // </div>
            )
          })}
        </Row>
      </Grid>
    </div>
  )
}

Category.Layout = CommonLayout
