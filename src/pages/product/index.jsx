import PostHelmet from 'component/PostHelmet'
import Card from 'component/UI/Content/Card'
import { CardSkeletonProduct } from 'component/UI/Content/CardSkeleton'
import Divider from 'component/UI/Content/Divider'
import PageHeader from 'component/UI/Content/PageHeader'
import CommonLayout from 'component/UI/Layout'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Pagination } from 'rsuite'
import { GlobalHomeService, GlobalProductService } from 'service/global'
import styles from './styles.module.scss'

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
    return [...Array(20).keys()].map((item) => {
      return (
        <div className={styles.gridItem}>
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
        <div className="col-12 p-0">
          <PageHeader type="h3" left divideClass={styles.divideLeft}>
            Sản phẩm
          </PageHeader>
        </div>
        <div className="col-12 p-0 py-2 border-top">
          <div className="container">
            <div className="row">
              {/* <div className="col-12">
                <p>
                  The category description can be positioned anywhere on the page via the layout page builder inside the
                </p>
              </div> */}

              <div className="col-12">
                <SideFilter onChange={onFilterChange} filter={filter} tagClick={tagClick} />
              </div>

              <Divider />

              <div className="col-12">
                <div className={styles.grid}>
                  {loading && renderSkeleton}

                  {!loading &&
                    product?.data?.map((prod) => {
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
