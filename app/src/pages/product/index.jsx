import clsx from 'clsx'
import PostHelmet from 'component/PostHelmet'
// import Card from 'component/UI/Content/Card'
// import Divider from 'component/UI/Content/Divider'
// import PageHeader from 'component/UI/Content/PageHeader'
// import { CardSkeletonProduct } from 'component/UI/Content/CardSkeleton'
import CommonLayout from 'component/UI/Layout'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Pagination } from 'rsuite'
import { GlobalHomeService, GlobalProductService } from 'service/global'
import styles from './styles.module.scss'

const Card = dynamic(() => import('component/UI/Content/Card'))
const PageHeader = dynamic(() => import('component/UI/Content/PageHeader'))
const Divider = dynamic(() => import('component/UI/Content/Divider'))
const CardSkeletonProduct = dynamic(() =>
  import('component/UI/Content/CardSkeleton').then((m) => m.CardSkeletonProduct),
)
const SideFilter = dynamic(() => import('component/UI/Content/SideFilter'))

export default function Product(props) {
  const [activePage, setActivePage] = useState(1)

  const [product, setProduct] = useState([])

  const [loading, setLoading] = useState(false)

  const [filter, setFilter] = useState({})

  const router = useRouter()

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
    return [...Array(20).keys()].map((item, index) => {
      return (
        <div className={styles.gridItem} key={[item, index].join('_')}>
          <CardSkeletonProduct />
        </div>
      )
    })
  }, [loading])

  const onFilterChange = (val) => {
    setFilter(val)
  }

  const tagClick = useCallback((v) => {
    router.push(`/category/${v.slug}`)
  }, [])

  return (
    <>
      <PostHelmet seo={props.seo} />

      <div className="row p-0">
        <div
          className="col-12 p-0 animate__animated animate__fadeInUp"
          style={{
            '--animate-duration': `${0.3}s`,
          }}
        >
          <PageHeader type="h3" left divideClass={styles.divideLeft}>
            Sản phẩm
          </PageHeader>
        </div>
        <div
          className="col-12 p-0 py-2 border-top"
          style={{
            '--animate-duration': `${0.4}s`,
          }}
        >
          <div className="container">
            <div className="row">
              <div
                className="col-12 animate__animated animate__fadeInUp"
                style={{
                  '--animate-duration': `${0.5}s`,
                }}
              >
                <SideFilter onChange={onFilterChange} filter={filter} tagClick={tagClick} />
              </div>

              <Divider
                className="animate__animated animate__fadeInUp"
                style={{
                  '--animate-duration': `${0.6}s`,
                }}
              />

              <div className="col-12 animate__animated animate__fadeInUp">
                <div className={styles.grid}>
                  {loading && renderSkeleton}

                  {!loading &&
                    product?.data?.map((prod, index) => {
                      return (
                        <Link href={`/product/${prod.slug}`} passHref key={prod._id}>
                          <a
                            className={clsx('animate__animated animate__fadeInUp', styles.gridItem)}
                            style={{
                              '--animate-duration': `${(0.2 * index) / 2}s`,
                            }}
                          >
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
                    })}
                </div>
              </div>
              <div className="col-12">
                <div className={styles.pagi}>
                  <Pagination
                    prev
                    next
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
