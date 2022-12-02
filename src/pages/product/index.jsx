import clsx from 'clsx'
import dynamic from 'next/dynamic'
import Card from 'component/UI/Content/Card'
import CardBlock from 'component/UI/Content/CardBlock'
import Divider from 'component/UI/Content/Divider'
import Heading from 'component/UI/Content/Heading'

// import SideFilter from 'component/UI/Content/SideFilter'

import CommonLayout from 'component/UI/Layout'

import Link from 'next/link'

import { useEffect, useState, useMemo } from 'react'

import { Pagination, SelectPicker } from 'rsuite'

import GlobalProductService from 'service/global/Product.service'

import styles from './styles.module.scss'

import PageHeader from 'component/UI/Content/PageHeader'
import { CardSkeletonProduct } from 'component/UI/Content/CardSkeleton'

const SideFilter = dynamic(() => import('component/UI/Content/SideFilter'))

const pricingFilter = [
  {
    label: 'Từ thấp đến cao',
    value: ['price', '1'],
  },
  {
    label: 'Từ cao đến đến',
    value: ['price', '-1'],
  },
  {
    label: 'Mới nhất',
    value: ['feature', '1'],
  },
  {
    label: 'Hot nhất',
    value: ['createdAt', '1'],
  },
]
export default function Product(props) {
  const [activePage, setActivePage] = useState(1)

  const [product, setProduct] = useState([])

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getProducts()
  }, [])

  const getProducts = async (query = null) => {
    try {
      setLoading(true)
      let params = {}
      if (query) {
        let [type, value] = query
        params = {
          [type]: value,
        }
      }

      const resp = await GlobalProductService.getProduct(params)
      setProduct(resp.data.data)

      console.log(resp.data.data)
    } catch (error) {
      console.log('getProducts error: ' + error)
    } finally {
      setLoading(false)
    }
  }

  const renderSkeleton = useMemo(() => {
    return [...Array(8).keys()].map((item) => {
      return (
        <div className="col-12 col-md-6 col-lg-4 col-xl-3">
          <CardSkeletonProduct />
        </div>
      )
    })
  }, [])

  return (
    <div className="row p-0">
      <div className="col-12 p-0">
        <PageHeader type="h3" left divideClass={styles.divideLeft}>
          Sản phẩm
        </PageHeader>
      </div>
      <div className="col-12 p-0 py-2 border-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-2 col-md-12">
              <SideFilter />
            </div>

            <div className={clsx([styles.vr, 'col-lg-10 col-md-12'])}>
              <CardBlock>
                <div className="row gy-4">
                  <div className="col-12">
                    <p>
                      The category description can be positioned anywhere on the page via the layout page builder inside
                      the
                    </p>
                  </div>
                  <Divider />
                  <div className="col-12">
                    <div className={styles.filter}>
                      <label>Pricing: </label>
                      <SelectPicker data={pricingFilter} style={{ width: 224 }} onChange={getProducts} />
                    </div>
                  </div>
                  {loading && renderSkeleton}

                  {product?.map((prod) => {
                    return (
                      <Link href={`/product/${prod.slug}`} passHref key={prod._id}>
                        <div className="col-12 col-md-6 col-lg-4 col-xl-3">
                          <Card
                            imgSrc={prod.img?.[0]?.filename}
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
              </CardBlock>
              <div className={styles.pagi}>
                <Pagination
                  prev
                  last
                  next
                  first
                  size="sm"
                  total={100}
                  limit={10}
                  activePage={activePage}
                  onChangePage={(page) => setActivePage(page)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Product.Layout = CommonLayout
