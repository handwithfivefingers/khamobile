import PostHelmet from 'component/PostHelmet'
import { CardSkeletonCategory } from 'component/UI/Content/CardSkeleton'
import PageHeader from 'component/UI/Content/PageHeader'
import CommonLayout from 'component/UI/Layout'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { Col, Grid, Panel, Placeholder, Row } from 'rsuite'
import GlobalCategoryService from 'service/global/Category.service'
import GlobalHomeService from 'service/global/Home.service'
import styles from './styles.module.scss'

const Card = (props) => {
  console.log(props)
  return (
    <Panel {...props} bordered header={<h5>{props.title}</h5>} style={{ backgroundImage: `url(${props.imgSrc})` }}>
      {props?.description ? <p style={{ minHeight: 46 }}>{props?.description}</p> : <Placeholder.Paragraph />}
    </Panel>
  )
}
export default function Category(props) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  useEffect(() => {
    getCateData()
  }, [])

  const getCateData = async () => {
    try {
      setLoading(true)
      let resp = await GlobalCategoryService.getProdCate()

      setData(resp.data.data)
    } catch (error) {
      console.log('error', error?.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  const renderSkeleton = useMemo(() => {
    return [...Array(8).keys()].map((item) => {
      return (
        <Col md={6} sm={12} style={{ margin: '6px 0' }}>
          <CardSkeletonCategory />
        </Col>
      )
    })
  }, [])

  return (
    <>
      <PostHelmet seo={props?.seo} />
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
                {loading && renderSkeleton}

                {data?.map((item, index) => {
                  return (
                    <Col
                      key={[index, item._id]}
                      md={6}
                      sm={12}
                      onClick={() => router.push(`/category/${item.slug}?page=1`)}
                    >
                      <Card
                        title={item.name}
                        className={styles.imageBg}
                        imgSrc={item.image && `${process.env.API}${item.image?.src}`}
                        description={item.description}
                      />
                    </Col>
                  )
                })}
              </Row>
            </Grid>
          </div>
        </div>
      </div>
    </>
  )
}

Category.Layout = CommonLayout

export const getServerSideProps = async (ctx) => {
  const resp = await GlobalHomeService.getCategorySeo()

  const data = resp.data
  return {
    props: {
      seo: data.seo,
    },
  }
}
