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

import { Button, Drawer, IconButton, Pagination, SelectPicker } from 'rsuite'

import GlobalProductService from 'service/global/Product.service'

import styles from './styles.module.scss'

import PageHeader from 'component/UI/Content/PageHeader'
import { CardSkeletonProduct } from 'component/UI/Content/CardSkeleton'
import FunnelIcon from '@rsuite/icons/Funnel'

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
  const [drawer, setDrawer] = useState({
    open: false,
    placement: 'left',
  })

  const [activePage, setActivePage] = useState(1)

  const [product, setProduct] = useState([])

  const [loading, setLoading] = useState(false)

  const [filter, setFilter] = useState({})

  useEffect(() => {
    getProducts()
  }, [filter, activePage])

  const getProducts = async () => {
    try {
      setLoading(true)

      let params = {}
      params = {
        activePage,
        pageSize: 16,
        ...filter,
      }

      const resp = await GlobalProductService.getProduct(params)

      // console.log(resp.data)

      setProduct(resp.data)
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

  const openFilter = (placement) => setDrawer({ open: true, placement })

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
            <div className={clsx('col-12 col-md-4 col-lg-2', styles.hideOnMD)}>
              <SideFilter />
            </div>

            <div className={clsx([styles.vr, 'col-12 col-md-8 col-lg-10'])}>
              <CardBlock>
                <div className="row gy-4">
                  <div className="col-12">
                    <p>
                      The category description can be positioned anywhere on the page via the layout page builder inside
                      the
                    </p>
                  </div>
                  <Divider />
                  <div className="col-6">
                    <div className={clsx(styles.filter, styles.showOnMD)}>
                      <label>Filter: </label>
                      <IconButton icon={<FunnelIcon />} onClick={() => openFilter('left')} />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className={styles.sort}>
                      <label>Pricing: </label>
                      <SelectPicker
                        data={pricingFilter}
                        style={{ width: 224 }}
                        onChange={(value) => {
                          console.log(value)
                          if (value) {
                            let [type, val] = value
                            setFilter({ ...filter, [type]: val })
                          } else {
                            setFilter(null)
                          }
                        }}
                      />
                    </div>
                  </div>

                  {loading && renderSkeleton}

                  {!loading &&
                    product?.data?.map((prod) => {
                      return (
                        <Link href={`/product/${prod.slug}`} passHref key={prod._id}>
                          <div className="col-12 col-md-6 col-lg-4 col-xl-3">
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
              </CardBlock>
              <div className={styles.pagi}>
                <Pagination
                  prev
                  last
                  next
                  first
                  size="sm"
                  total={product?.total}
                  limit={16}
                  activePage={activePage}
                  onChangePage={(page) => setActivePage(page)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Drawer
        placement={drawer.placement}
        open={drawer.open}
        onClose={() => setDrawer({ ...drawer, open: false })}
        size="xs"
      >
        <Drawer.Header>
          <Drawer.Title>Lọc sản phẩm</Drawer.Title>
          <Drawer.Actions>
            <Button onClick={() => setDrawer({ ...drawer, open: false })}>Cancel</Button>
            <Button onClick={() => setDrawer({ ...drawer, open: false })} appearance="primary">
              Confirm
            </Button>
          </Drawer.Actions>
        </Drawer.Header>
        <Drawer.Body>
          <SideFilter />
        </Drawer.Body>
      </Drawer>
    </div>
  )
}

Product.Layout = CommonLayout
