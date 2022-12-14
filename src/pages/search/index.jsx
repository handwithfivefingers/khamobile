import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { NextSeo, SiteLinksSearchBoxJsonLd } from 'next-seo'
import PageHeader from 'component/UI/Content/PageHeader'
import { Col, Divider, Row, Tag } from 'rsuite'
import styles from './styles.module.scss'
import clsx from 'clsx'
import Link from 'next/link'
import GlobalCategoryService from 'service/global/Category.service'
import { CardSkeletonProduct } from 'component/UI/Content/CardSkeleton'
import ProductService from 'service/admin/Product.service'
import { BsInboxes } from 'react-icons/bs'
import NoData from 'component/UI/Content/NoData'
import Card from 'component/UI/Content/Card'

export default function Search() {
  const router = useRouter()
  const [category, setCategory] = useState([])

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    getCategories()
    let { q } = router.query
    console.log(q)
    if (q) {
      getScreenData(q)
    }
  }, [router.query])

  const getCategories = async () => {
    const resp = await GlobalCategoryService.getProdCate({ all: true })
    if (resp.status === 200) {
      setCategory(resp.data.data)
    }
  }

  const getScreenData = async (q) => {
    try {
      setLoading(true)
      const resp = await ProductService.searchProduct({ title: q })
      console.log('resp', resp)

      setData(resp.data.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const renderProduct = () => {
    let html = null

    if (!data) {
      html = <NoData style={{ gridColumn: '1/6' }} />
    } else {
      html = data?.map((prod) => {
        return (
          <Link href={`/product/${prod.slug}`} passHref key={prod._id}>
            <a className={styles.gridItem}>
              <Card
                imgSrc={prod.image?.[0]?.src ? prod.image?.[0]?.src : ''}
                title={prod.title}
                price={prod.price}
                underlinePrice={prod?.underlinePrice || null}
                type={prod.type}
                variable={prod.variable}
                hover
              />
            </a>
          </Link>
        )
      })
    }
    return html
  }

  const renderSkeleton = useMemo(() => {
    return [...Array(20).keys()].map((item) => {
      return (
        <div className={styles.gridItem}>
          <CardSkeletonProduct />
        </div>
      )
    })
  }, [data])

  return (
    <>
      <NextSeo
        title="T??m ki???m - Khamobile"
        description="T??m ki???m s???n ph???m"
        canonical={process.env.host + '/search'}
        openGraph={{
          url: process.env.host,
          title: 'Open Graph Title',
          description: 'Open Graph Description',
          siteName: process.env.APP_NAME,
        }}
      />

      <SiteLinksSearchBoxJsonLd
        url={process.env.host}
        potentialActions={[
          {
            target: `${process.env.host}/search?q`,
            queryInput: 'page',
          },
        ]}
      />

      <div className="row p-0">
        <div className="col-12 p-0">
          <PageHeader type="h3" left divideClass={styles.divideLeft}>
            K???t Qu??? T??m Ki???m: '{router.query.q}'
          </PageHeader>
        </div>
        <div className="col-12 p-0 py-2 border-top">
          <div className="container product_detail">
            <div className="row gy-4">
              <div className={clsx([styles.vr, 'col-12'])}>
                <Row gutter={12}>
                  <Col md={24}>
                    <h3>Danh m???c</h3>
                    <div className={styles.category}>
                      {category?.map((item) => (
                        <Link passHref href={process.env.host + '/category/' + item.slug}>
                          <a>
                            <Tag size="md" color="blue">
                              {item.name}
                            </Tag>
                          </a>
                        </Link>
                      ))}
                    </div>
                  </Col>
                </Row>
                <Divider />
                <div className={styles.grid}>
                  {loading && renderSkeleton}
                  {renderProduct()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
