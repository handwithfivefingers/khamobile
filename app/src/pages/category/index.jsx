import PostHelmet from 'component/PostHelmet'
import CommonLayout from 'component/UI/Layout'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { Col, Grid, Panel, Placeholder, Row } from 'rsuite'
import { GlobalHomeService, GlobalCategoryService } from 'service/global'
import styles from './styles.module.scss'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import clsx from 'clsx'

const PageHeader = dynamic(() => import('component/UI/Content/PageHeader'))
const CardSkeletonCategory = dynamic(() =>
  import('component/UI/Content/CardSkeleton').then((m) => m.CardSkeletonCategory),
)
const Card = (props) => {
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

  const renderCategory = useMemo(() => {
    let html = null
    html = data?.map((item, index) => {
      return (
        <Link href={`/category/${item.slug}?page=1`} key={[index, item._id]} className="col-span-6 md:col-span-6 lg:col-span-4 xl:col-span-3">
          <Card
            title={item.name}
            className={clsx(styles.imageBg)}
            imgSrc={item.image && `${process.env.API}${item.image?.src}`}
            description={item.description}
          />
        </Link>
      )
    })

    return html
  }, [data])

  return (
    <>
      <PostHelmet seo={props?.seo} />
      <div className="grid grid-cols-12 p-0">
        <div className="col-span-12 px-4">
          <PageHeader type="h3" left divideClass={styles.divideLeft}>
            Danh mục
          </PageHeader>
        </div>
        <div className="col-span-12 px-4 py-2 border-t-2">
          <div className="container mx-auto p-0">
            <div className="grid grid-cols-12 gap-4">
              {loading && renderSkeleton}
              {renderCategory}
            </div>
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
