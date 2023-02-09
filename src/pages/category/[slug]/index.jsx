import clsx from 'clsx'
import PostHelmet from 'component/PostHelmet'
import Card from 'component/UI/Content/Card'
import CardBlock from 'component/UI/Content/CardBlock'
import NoData from 'component/UI/Content/NoData'
import PageHeader from 'component/UI/Content/PageHeader'
import SideFilter from 'component/UI/Content/SideFilter'
import CommonLayout from 'component/UI/Layout'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { BsInboxes } from 'react-icons/bs'
import { Button, Col, Divider, Drawer, Pagination, Row } from 'rsuite'
import GlobalCategoryService from 'service/global/Category.service'
import styles from './styles.module.scss'

export default function SingleCategory({ data, query, seo, ...rest }) {
  const [drawer, setDrawer] = useState({
    open: false,
    placement: 'left',
  })
  const cardRef = useRef()

  const router = useRouter()

  const [filter, setFilter] = useState({})

  const onFilterChange = (val) => {
    setFilter(val)
  }
  const onChangePage = (page) => {
    const { slug, ...qs } = query
    router.push({
      pathname: `/category/${slug}`,
      query: { ...qs, page },
    })
  }

  if (!data) {
    return <NoData />
  }

  const renderProduct = () => {
    let html = null
    if (data?.product?.items?.length) {
      html = (
        <Row gutter={12} ref={cardRef}>
          <Col md={24}>
            <div className={styles.grid}>
              {data?.product?.items?.map((item) => {
                return (
                  <Card
                    key={item._id}
                    imgSrc={item.image?.[0]?.src || ''}
                    title={item.title}
                    price={item.price}
                    underlinePrice={item?.underlinePrice || null}
                    type={item.type}
                    variable={item.variable}
                    slug={`/product/${item.slug}`}
                    hover
                  />
                )
              })}
            </div>
          </Col>
          <div className={styles.pagi}>
            <Pagination
              prev
              last
              next
              first
              size="sm"
              total={data?.total}
              limit={20}
              activePage={+query?.page}
              onChangePage={onChangePage}
            />
          </div>
        </Row>
      )
    } else {
      html = (
        <div className="d-flex justify-content-center flex-column align-items-center">
          <BsInboxes style={{ fontSize: 36, color: 'var(--rs-blue-800)' }} />
          <p className="text-secondary">Không có sản phẩm phù hợp với tiêu chí bạn tìm</p>
        </div>
      )
    }
    return html
  }

  return (
    <>
      <PostHelmet seo={data?.seo} />
      <div className="row p-0">
        <div className="col-12 p-0">
          <PageHeader type="h3" left divideClass={styles.divideLeft}>
            Danh mục: {data?.cate?.name}
          </PageHeader>
        </div>
        <div className="col-12 p-0 py-2 border-top">
          <div className="container product_detail">
            <div className="row gy-4">
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
                {renderProduct()}
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
            <Drawer.Title>Drawer Title</Drawer.Title>
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
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  const { slug, page, pageSize, maxPrice, price, createdAt } = ctx.query

  const resp = await GlobalCategoryService.getProdByCategorySlug(slug, {
    pageSize: pageSize || 20,
    activePage: page,
    maxPrice,
    price,
    createdAt,
  })
  const data = resp.data
  return {
    props: { ...data, query: ctx.query },
  }
}

SingleCategory.Layout = CommonLayout
