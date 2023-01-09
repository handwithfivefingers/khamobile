import clsx from 'clsx'
import dynamic from 'next/dynamic'
import Card from 'component/UI/Content/Card'
import CardBlock from 'component/UI/Content/CardBlock'
import Divider from 'component/UI/Content/Divider'
import Heading from 'component/UI/Content/Heading'

// import SideFilter from 'component/UI/Content/SideFilter'

import CommonLayout from 'component/UI/Layout'

import Link from 'next/link'

import { useEffect, useState, useMemo, useRef } from 'react'

import { Button, Col, Drawer, IconButton, Pagination, Row, SelectPicker } from 'rsuite'

import GlobalProductService from 'service/global/Product.service'

import styles from './styles.module.scss'

import PageHeader from 'component/UI/Content/PageHeader'

import { CardSkeletonProduct } from 'component/UI/Content/CardSkeleton'
import PostHelmet from 'component/PostHelmet'
import GlobalHomeService from 'service/global/Home.service'

const SideFilter = dynamic(() => import('component/UI/Content/SideFilter'))

export default function Product(props) {
  const [activePage, setActivePage] = useState(1)

  const [product, setProduct] = useState([])

  const [loading, setLoading] = useState(false)

  const [filter, setFilter] = useState({})

  const cardRef = useRef()

  useEffect(() => {
    getProducts()
  }, [filter, activePage])

  const getProducts = async () => {
    try {
      setLoading(true)

      let params = {}
      params = {
        activePage,
        pageSize: 20,
        ...filter,
      }

      const resp = await GlobalProductService.getProduct(params)

      setProduct(resp.data)
    } catch (error) {
      console.log('getProducts error: ' + error)
    } finally {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
      setLoading(false)
    }
  }

  const renderSkeleton = useMemo(() => {
    return [...Array(20).keys()].map((item) => {
      return (
        <div className={styles.gridItem}>
          <CardSkeletonProduct />
        </div>
      )
    })
  }, [])

  const onFilterChange = (val) => {
    setFilter(val)
  }

  return (
    <>
      <PostHelmet seo={props.seo} />

      <div className="row p-0">
        <div className="col-12 p-0">
          <PageHeader type="h3" left divideClass={styles.divideLeft}>
            Sản phẩm
          </PageHeader>
        </div>
        <div className="col-12 p-0 py-2 border-top">
          <div className="container">
            <div className="row">
              <div className={clsx([styles.vr, 'col-12'])}>
                <Row gutter={12}>
                  <Col md={24}>
                    <p>
                      The category description can be positioned anywhere on the page via the layout page builder inside
                      the
                    </p>
                  </Col>

                  <Col md={24}>
                    <SideFilter onChange={onFilterChange} filter={filter} />
                  </Col>
                </Row>
                <Divider />

                <Row gutter={12} ref={cardRef}>
                  <Col md={24}>
                    <div className={styles.grid}>
                      {loading && renderSkeleton}

                      {!loading &&
                        product?.data?.map((prod) => {
                          return (
                            <Link href={`/product/${prod.slug}`} passHref key={prod._id}>
                              <div className={styles.gridItem}>
                                <Card
                                  imgSrc={prod.image?.[0]?.src ? prod.image?.[0]?.src : ''}
                                  title={prod.title}
                                  price={prod.price}
                                  underlinePrice={prod?.underlinePrice || null}
                                  type={prod.type}
                                  variable={prod.variable}
                                  hover
                                />
                              </div>
                            </Link>
                          )
                        })}
                    </div>
                  </Col>
                </Row>
                <div className={styles.pagi}>
                  <Pagination
                    prev
                    last
                    next
                    first
                    size="sm"
                    total={product?.total}
                    limit={20}
                    activePage={activePage}
                    onChangePage={(page) => {
                      setActivePage(page)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

Product.Layout = CommonLayout

export const getServerSideProps = async (ctx) => {
  const resp = await GlobalHomeService.getProductSeo()

  const data = resp.data
  return {
    props: {
      seo: data.seo,
    },
  }
}
